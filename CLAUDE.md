# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start Next.js dev server on port 3000
pnpm build            # Production build (also runs type checking)
pnpm lint             # ESLint with Next.js core web vitals + TypeScript rules
pnpm seed             # Populate vector store from src/data/seed/ markdown files
tsc --noEmit          # Type check without emitting (no test framework configured)
```

## Architecture

**Next.js 16 App Router** portfolio site with an AI chat interface. Users ask questions about the portfolio owner's experience, skills, and projects — an LLM responds using portfolio context injected into the system prompt.

### Data Flow (Portfolio Context)

Three-tier fallback cascade managed by `src/lib/portfolio/merged.ts`:

1. **Upstash Redis KV override** — structured data extracted from resume via LLM (`portfolio-override` key)
2. **Uploaded PDF text** — raw document text from `data/uploads/` (legacy path)
3. **Static `src/data/portfolio.ts`** — hardcoded fallback

`getPortfolioData()` is the single source of truth. All UI components and the system prompt consume its output (`MergedPortfolioData`). The `isOverridden` flag tells the system prompt builder which context source to use.

### Server/Client Boundary

- **Server Components**: `src/app/chat/page.tsx` fetches `getPortfolioData()` and passes it as props to the client `ChatContent` component. Admin pages fetch auth/data server-side.
- **Client Components**: Homepage (`page.tsx`), all chat UI (`src/components/chat/`), admin forms. Topic views (`src/components/topics/`) are pure presentational — they receive data as props, never import `portfolio.ts` directly.

### Chat/LLM System

- **API**: `POST /api/chat` receives `{ query }`, classifies topic via keyword heuristics (`src/lib/utils/topicClassifier.ts`), builds system prompt with portfolio context, streams response via SSE.
- **LLM Provider**: Factory pattern in `src/lib/llm/provider.ts` — supports Ollama, OpenAI, Anthropic, Groq via LangChain. Configured by `LLM_PROVIDER` and `LLM_MODEL` env vars.
- **System Prompt**: `src/lib/prompts/system.ts` — `getSystemPrompt(topic)` is async, builds Staff Engineer/EM persona with topic-specific focus instructions. Context priority: KV override > uploaded PDFs > static portfolio.
- **LangGraph**: `src/lib/graph/` defines a state-machine workflow (topicRouter → retriever → contextFormatter → llmResponder). Available for RAG-enhanced flow.

### Admin Panel

- **Auth**: NextAuth v5 credentials provider (`src/auth.ts`), validates against `ADMIN_PASSWORD` env var. Middleware in `src/proxy.ts` protects `/admin/*` routes.
- **Routes**: `/admin` (dashboard), `/admin/documents` (upload/manage), `/admin/settings` (LLM config).
- **Resume Extraction**: `POST /api/admin/extract` parses a PDF, calls LLM with structured JSON prompt, validates output with Zod (`src/lib/portfolio/types.ts`), writes to Upstash Redis KV.
- **Blob Storage**: Resume PDFs auto-upload to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set (`src/lib/portfolio/blob.ts`).

### Key Paths

| Path | Purpose |
|------|---------|
| `src/data/portfolio.ts` | Static portfolio data (profile, projects, skills, experience, contact) |
| `src/lib/portfolio/` | Data layer: `merged.ts` (single source), `kv.ts` (Redis), `extract.ts` (LLM parsing), `types.ts` (Zod schemas) |
| `src/lib/prompts/system.ts` | System prompt builder with Staff Engineer persona |
| `src/lib/llm/provider.ts` | LLM factory (Ollama/OpenAI/Anthropic/Groq) |
| `src/lib/graph/` | LangGraph chat workflow |
| `src/lib/rag/` | RAG pipeline (chunker, vectorStore, retriever, fileParser) |
| `src/app/api/chat/route.ts` | Chat SSE endpoint |
| `src/app/api/admin/extract/route.ts` | Resume extraction endpoint (POST/GET/DELETE) |
| `data/uploads/` | Locally stored uploaded documents |
| `src/data/config.json` | Persisted LLM settings (file-based) |
| `src/data/documents.json` | Document metadata registry |

## Environment Variables

**Minimum for local dev** (Ollama running locally):
```
LLM_PROVIDER=ollama
LLM_MODEL=llama3.2
```

**For cloud LLM providers** (set one):
```
GROQ_API_KEY=        # with LLM_PROVIDER=groq
OPENAI_API_KEY=      # with LLM_PROVIDER=openai
ANTHROPIC_API_KEY=   # with LLM_PROVIDER=anthropic
```

**For portfolio extraction + blob storage** (optional):
```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
BLOB_READ_WRITE_TOKEN=
```

**For admin auth** (optional):
```
ADMIN_PASSWORD=
AUTH_SECRET=
```

**For RAG/vector search** (optional):
```
PINECONE_API_KEY=
UPSTASH_VECTOR_REST_URL=
UPSTASH_VECTOR_REST_TOKEN=
JINA_API_KEY=
```

## Conventions

- **Package manager**: pnpm (workspace configured, approves esbuild)
- **Path alias**: `@/*` maps to `./src/*`
- **Styling**: Tailwind CSS v4 with CSS-variable theme (accent color: `--color-accent: #f97066`)
- **Validation**: Zod schemas for all KV data and LLM extraction output
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **External packages**: `pdf-parse` and `pdfjs-dist` are marked as server external in `next.config.ts` to avoid Turbopack bundling issues
- All KV/Blob features silently degrade when env vars are absent — `isKvConfigured()` guard returns null instead of throwing
