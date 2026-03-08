import { createLLM } from "@/lib/llm/provider";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { ChatGraphStateType } from "../state";

export async function llmResponder(
  state: ChatGraphStateType
): Promise<Partial<ChatGraphStateType>> {
  const llm = createLLM();
  const result = await llm.invoke([
    new SystemMessage(state.systemPrompt),
    new HumanMessage(state.query),
  ]);

  const response =
    typeof result.content === "string" ? result.content : "";
  return { response };
}
