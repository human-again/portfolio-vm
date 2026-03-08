import { classifyTopic } from "@/lib/utils/topicClassifier";
import type { ChatGraphStateType } from "../state";

export async function topicRouter(
  state: ChatGraphStateType
): Promise<Partial<ChatGraphStateType>> {
  const topic = classifyTopic(state.query);
  return { topic };
}
