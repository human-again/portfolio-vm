import { getVectorStore } from "./vectorStore";
import type { Document } from "@langchain/core/documents";
import type { Topic } from "@/data/portfolio";

export async function retrieveContext(
  query: string,
  topic?: Topic,
  topK: number = 5
): Promise<Document[]> {
  const store = await getVectorStore();

  const filter = topic && topic !== "general" ? { topic } : undefined;

  const results = await store.similaritySearch(query, topK, filter);
  return results;
}

export function formatContext(documents: Document[]): string {
  if (documents.length === 0) {
    return "No additional context available.";
  }

  return documents
    .map((doc, i) => `[${i + 1}] ${doc.pageContent}`)
    .join("\n\n");
}
