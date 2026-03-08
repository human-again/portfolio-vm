import { retrieveContext } from "@/lib/rag/retriever";
import type { ChatGraphStateType } from "../state";

export async function retrieverNode(
  state: ChatGraphStateType
): Promise<Partial<ChatGraphStateType>> {
  try {
    const documents = await retrieveContext(state.query, state.topic, 5);
    return { documents };
  } catch (error) {
    console.warn("RAG retrieval failed, continuing without context:", error);
    return { documents: [] };
  }
}
