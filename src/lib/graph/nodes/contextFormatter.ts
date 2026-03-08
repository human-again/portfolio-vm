import { formatContext } from "@/lib/rag/retriever";
import { buildPromptWithContext } from "@/lib/prompts/system";
import type { ChatGraphStateType } from "../state";

export async function contextFormatter(
  state: ChatGraphStateType
): Promise<Partial<ChatGraphStateType>> {
  const context = formatContext(state.documents);
  const systemPrompt = await buildPromptWithContext(state.topic, context, state.query);
  return { context, systemPrompt };
}
