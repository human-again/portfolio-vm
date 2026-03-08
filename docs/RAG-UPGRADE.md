# RAG Upgrade Guide

> **When to use this guide:** The base setup (Option 2 — system prompt stuffing) handles portfolios up to
> ~100K tokens comfortably on Groq's 128K-context models. If your combined portfolio content grows beyond
> that threshold, follow this guide to add zero-cost, Vercel-compatible semantic search.

---

## Current Architecture (System Prompt Stuffing)

```
POST /api/chat
  → classifyTopic(query)          # keyword heuristics
  → getSystemPrompt(topic)        # serialises portfolio.ts → plain text block
  → llm.stream([system, human])   # Groq (prod) / Ollama (local)
  → SSE stream to client
```

**Pros:** Zero infrastructure, instant setup, works everywhere, free on Groq (14K req/day).
**Cons:** Every request burns the full portfolio context (~5–15K tokens). Scales to ~100K tokens of content before hitting model limits.

---

## Upgrade Architecture (Jina + Upstash Vector)

```
POST /api/chat
  → classifyTopic(query)
  → embedQuery(query)             # Jina AI — free 1M tokens
  → vectorStore.search(embedding, { topic, k: 5 })   # Upstash Vector — free
  → buildPromptWithContext(topic, ragChunks, query)  # already in system.ts
  → llm.stream([system, human])
  → SSE stream to client
```

Both services are **serverless HTTP APIs** — no persistent connections, no cold starts, Vercel-compatible.

---

## Services

| Service | Free Tier | Use |
|---|---|---|
| [Jina AI](https://jina.ai) | 1M tokens/month | Text embeddings (`jina-embeddings-v3`) |
| [Upstash Vector](https://upstash.com/vector) | 10K vectors, 10K queries/day | Vector store (serverless, HTTP) |
| Groq | 14K requests/day | Chat LLM (already configured) |

No credit card required for either free tier.

---

## Step-by-Step Setup

### 1. Get API Keys

**Jina AI:**
1. Go to [jina.ai](https://jina.ai) → Sign in with GitHub
2. Dashboard → API Keys → Copy key (`jina_...`)

**Upstash Vector:**
1. Go to [console.upstash.com](https://console.upstash.com) → Create account
2. Vector → Create Index:
   - Name: `portfolio-chat`
   - Dimensions: `1024` (matches `jina-embeddings-v3`)
   - Distance metric: `Cosine`
3. Copy the **REST URL** and **REST Token**

### 2. Install Dependencies

```bash
pnpm add @upstash/vector
# Jina uses plain fetch — no SDK needed
```

### 3. Add Environment Variables

**Local (`.env.local`):**
```bash
JINA_API_KEY=jina_...
UPSTASH_VECTOR_REST_URL=https://your-index.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your-token
```

**Vercel Dashboard:**
Add the same three variables under Settings → Environment Variables.

### 4. Create the Jina Embedder

Create `src/lib/rag/jinaEmbedder.ts`:

```typescript
const JINA_EMBED_URL = "https://api.jina.ai/v1/embeddings";
const JINA_MODEL = "jina-embeddings-v3";
const DIMENSIONS = 1024;

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const res = await fetch(JINA_EMBED_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.JINA_API_KEY}`,
    },
    body: JSON.stringify({ model: JINA_MODEL, input: texts }),
  });
  if (!res.ok) throw new Error(`Jina embedding failed: ${res.statusText}`);
  const json = await res.json();
  return json.data.map((d: { embedding: number[] }) => d.embedding);
}

export async function embedQuery(text: string): Promise<number[]> {
  const [embedding] = await embedTexts([text]);
  return embedding;
}

export { DIMENSIONS };
```

### 5. Create the Upstash Vector Store

Create `src/lib/rag/upstashStore.ts`:

```typescript
import { Index } from "@upstash/vector";

export interface VectorMetadata {
  topic: string;
  source: string;
  text: string;
  chunkIndex: number;
}

let _index: Index<VectorMetadata> | null = null;

export function getVectorIndex(): Index<VectorMetadata> {
  if (!_index) {
    _index = new Index<VectorMetadata>({
      url: process.env.UPSTASH_VECTOR_REST_URL!,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
    });
  }
  return _index;
}

export async function upsertVectors(
  vectors: Array<{ id: string; vector: number[]; metadata: VectorMetadata }>
): Promise<void> {
  const index = getVectorIndex();
  // Upstash supports batches of up to 1000
  const BATCH = 100;
  for (let i = 0; i < vectors.length; i += BATCH) {
    await index.upsert(vectors.slice(i, i + BATCH));
  }
}

export async function queryVectors(
  vector: number[],
  topK: number,
  topic?: string
): Promise<Array<{ text: string; score: number }>> {
  const index = getVectorIndex();
  const filter = topic && topic !== "general" ? `topic = '${topic}'` : undefined;
  const results = await index.query({
    vector,
    topK,
    includeMetadata: true,
    filter,
  });
  return results
    .filter((r) => r.metadata)
    .map((r) => ({ text: r.metadata!.text, score: r.score ?? 0 }));
}

export async function deleteBySource(source: string): Promise<void> {
  const index = getVectorIndex();
  // Upstash filter-based delete
  await index.deleteMany({
    filter: `source = '${source}'`,
  });
}
```

### 6. Update the Ingestion Pipeline

Update `src/lib/rag/pipeline.ts` to use Jina + Upstash instead of OpenAI + Pinecone:

```typescript
import { embedTexts } from "./jinaEmbedder";
import { upsertVectors, deleteBySource } from "./upstashStore";
import { chunkText } from "./chunker";
import { parseFile } from "./fileParser";
import { v4 as uuidv4 } from "uuid";

export async function ingestDocument(
  filePath: string,
  topic: string,
  source: string
): Promise<number> {
  const text = await parseFile(filePath);
  const chunks = await chunkText(text);

  const embeddings = await embedTexts(chunks);

  const vectors = chunks.map((chunk, i) => ({
    id: uuidv4(),
    vector: embeddings[i],
    metadata: { topic, source, text: chunk, chunkIndex: i },
  }));

  await upsertVectors(vectors);
  return chunks.length;
}

export async function deleteDocument(source: string): Promise<void> {
  await deleteBySource(source);
}
```

### 7. Update the Chat API Route

Update `src/app/api/chat/route.ts` to add RAG retrieval:

```typescript
import { NextRequest } from "next/server";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { createLLM } from "@/lib/llm/provider";
import { classifyTopic } from "@/lib/utils/topicClassifier";
import { buildPromptWithContext, getSystemPrompt } from "@/lib/prompts/system";
import { embedQuery } from "@/lib/rag/jinaEmbedder";
import { queryVectors } from "@/lib/rag/upstashStore";

const RAG_ENABLED =
  !!process.env.JINA_API_KEY && !!process.env.UPSTASH_VECTOR_REST_URL;

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const topic = classifyTopic(query);

    let systemPrompt: string;
    if (RAG_ENABLED) {
      // Retrieve relevant chunks from Upstash
      const queryEmbedding = await embedQuery(query);
      const chunks = await queryVectors(queryEmbedding, 5, topic);
      const ragContext = chunks.map((c) => c.text).join("\n\n---\n\n");
      systemPrompt = buildPromptWithContext(topic, ragContext, query);
    } else {
      // Fallback: full portfolio context in system prompt (current default)
      systemPrompt = getSystemPrompt(topic);
    }

    const llm = createLLM();
    const stream = await llm.stream([
      new SystemMessage(systemPrompt),
      new HumanMessage(query),
    ]);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ topic })}\n\n`)
        );
        try {
          for await (const chunk of stream) {
            const token =
              typeof chunk.content === "string" ? chunk.content : "";
            if (token) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ token })}\n\n`)
              );
            }
          }
        } catch (err) {
          console.error("Streaming error:", err);
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
```

**Note:** `buildPromptWithContext` is already implemented in `src/lib/prompts/system.ts` — it was kept there for exactly this upgrade.

### 8. Seed Your Documents

```bash
# Make sure JINA_API_KEY and UPSTASH_VECTOR_REST_URL/TOKEN are set in .env.local
pnpm seed
```

This runs `scripts/seed.ts` which ingests all files in `src/data/seed/`. Add your own markdown or PDF files there and update the seed script to assign correct topic labels.

---

## Dimension Reference

| Embedding Model | Dimensions | Provider |
|---|---|---|
| `jina-embeddings-v3` | **1024** | Jina AI (free) |
| `text-embedding-3-small` | 1536 | OpenAI (paid) |
| `nomic-embed-text` | 768 | Ollama (local only) |

> **Important:** If you previously used a different embedding model, recreate the Upstash index with the correct dimensions before re-seeding.

---

## Cost Estimate

For a typical portfolio with ~50K tokens of content:

| Service | Usage | Cost |
|---|---|---|
| Jina AI embeddings | ~500 chunks × 256 tokens = ~128K tokens total | **Free** (1M/month) |
| Upstash Vector storage | ~500 vectors | **Free** (10K limit) |
| Upstash Vector queries | ~100 queries/day | **Free** (10K/day limit) |
| Groq LLM | ~100 requests/day | **Free** (14K/day limit) |
| **Total** | | **$0/month** |

---

## Scaling Beyond Free Tiers

| Threshold | Recommendation |
|---|---|
| > 10K vectors | Upgrade Upstash Vector to Pay-as-you-go (~$0.40/100K vectors) |
| > 1M embed tokens/month | Upgrade Jina AI ($0.02/1M tokens) |
| > 14K LLM requests/day | Add OpenAI (`gpt-4o-mini`) as fallback provider |

---

## Troubleshooting

**"No relevant context found"** — Index may be empty. Run `pnpm seed` and check Upstash dashboard for vector count.

**"Jina 401 Unauthorized"** — Check `JINA_API_KEY` is set in both `.env.local` and Vercel environment variables.

**"Upstash connection error"** — Verify both `UPSTASH_VECTOR_REST_URL` and `UPSTASH_VECTOR_REST_TOKEN` are set. The URL should start with `https://`.

**"Dimension mismatch"** — Your Upstash index was created with different dimensions. Delete and recreate the index with `1024` dimensions for `jina-embeddings-v3`.

**Responses ignore uploaded documents** — RAG only activates when both `JINA_API_KEY` and `UPSTASH_VECTOR_REST_URL` are set. Check the server logs for `RAG_ENABLED` status.
