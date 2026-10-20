import { NextRequest } from "next/server";
import { createChatGraph } from "@/lib/graph/workflow";
import { rateLimit } from "@/lib/utils/rateLimit";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/chat
//
// Delegates to the LangGraph workflow (createChatGraph), which runs:
//   topicRouter → retriever → contextFormatter → llmResponder
//
// The llmResponder node calls createLLMAsync(), which reads admin-configured
// LLM settings (provider, model, temperature, maxTokens) from Vercel KV,
// falling back to process.env.* and hardcoded defaults when KV is unavailable.
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

    const result = await createChatGraph().invoke({ query });
    const { topic, response } = result;

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      start(controller) {
        // First event tells the client which topic was detected
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ topic })}\n\n`),
        );

        // Emit the full response as a single token event
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ token: response })}\n\n`),
        );

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
