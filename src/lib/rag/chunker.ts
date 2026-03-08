import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import type { Document } from "@langchain/core/documents";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ["\n\n", "\n", ". ", " ", ""],
});

export async function chunkText(
  text: string,
  metadata: Record<string, string> = {}
): Promise<Document[]> {
  const docs = await splitter.createDocuments([text], [metadata]);
  return docs;
}

export async function chunkDocuments(
  documents: { text: string; metadata: Record<string, string> }[]
): Promise<Document[]> {
  const allChunks: Document[] = [];
  for (const doc of documents) {
    const chunks = await chunkText(doc.text, doc.metadata);
    allChunks.push(...chunks);
  }
  return allChunks;
}
