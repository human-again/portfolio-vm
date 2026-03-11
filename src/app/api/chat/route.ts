import { NextRequest } from "next/server";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { createLLMAsync } from "@/lib/llm/provider";
import { classifyTopic } from "@/lib/utils/topicClassifier";
import { getSystemPrompt } from "@/lib/prompts/system";
import { rateLimit } from "@/lib/utils/rateLimit";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/chat
//
// System prompt is built by getSystemPrompt() which:
//   1. If KV override exists → uses structured extracted data (no duplication)
//   2. Else if uploaded PDFs exist → injects raw uploaded text (legacy path)
//   3. Else → uses static portfolio.ts
//
// Scales comfortably to ~100K tokens of portfolio content on Groq (128K ctx).
// When content exceeds that threshold, see docs/RAG-UPGRADE.md for the
// zero-cost Vercel-compatible RAG upgrade path (Jina + Upstash Vector).
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (query.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Query exceeds maximum length of 2000 characters" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const topic = classifyTopic(query);
    const systemPrompt = await getSystemPrompt(topic);

    const llm = await createLLMAsync();
    const stream = await llm.stream([
      new SystemMessage(systemPrompt),
      new HumanMessage(query),
    ]);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        // First event tells the client which topic was detected
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ topic })}\n\n`),
        );

        try {
          for await (const chunk of stream) {
            const token =
              typeof chunk.content === "string" ? chunk.content : "";
            if (token) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ token })}\n\n`),
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
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
