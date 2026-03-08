import { Annotation } from "@langchain/langgraph";
import type { Document } from "@langchain/core/documents";
import type { Topic } from "@/data/portfolio";

export const ChatGraphState = Annotation.Root({
  query: Annotation<string>,
  topic: Annotation<Topic>,
  documents: Annotation<Document[]>({
    default: () => [],
    reducer: (_, next) => next,
  }),
  context: Annotation<string>({
    default: () => "",
    reducer: (_, next) => next,
  }),
  systemPrompt: Annotation<string>({
    default: () => "",
    reducer: (_, next) => next,
  }),
  response: Annotation<string>({
    default: () => "",
    reducer: (_, next) => next,
  }),
});

export type ChatGraphStateType = typeof ChatGraphState.State;
