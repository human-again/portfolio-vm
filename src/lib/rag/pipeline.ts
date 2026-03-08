import { getVectorStore, getEmbeddings } from "./vectorStore";
import { chunkText } from "./chunker";
import { parseFile } from "./fileParser";
import { PineconeStore } from "@langchain/pinecone";
import { getPineconeIndex } from "./vectorStore";
import type { Topic } from "@/data/portfolio";

export interface IngestOptions {
  filePath: string;
  topic: Topic;
  source: string;
}

const RAG_ENABLED = !!process.env.PINECONE_API_KEY && !!process.env.OPENAI_API_KEY;

export async function ingestDocument(options: IngestOptions): Promise<number> {
  const { filePath, topic, source } = options;

  const text = await parseFile(filePath);
  const chunks = await chunkText(text, { topic, source });

  if (!RAG_ENABLED) {
    // RAG not configured — file is stored locally but not embedded.
    // See docs/RAG-UPGRADE.md to enable vector search.
    console.log(`[RAG disabled] Parsed ${chunks.length} chunks from ${source} (not embedded)`);
    return chunks.length;
  }

  const store = await getVectorStore();
  await store.addDocuments(chunks);

  return chunks.length;
}

export async function ingestText(
  text: string,
  topic: Topic,
  source: string
): Promise<number> {
  const chunks = await chunkText(text, { topic, source });

  if (!RAG_ENABLED) {
    return chunks.length;
  }

  const store = await getVectorStore();
  await store.addDocuments(chunks);

  return chunks.length;
}

export async function deleteBySource(source: string): Promise<void> {
  if (!RAG_ENABLED) return;

  const index = await getPineconeIndex();
  await index.deleteMany({
    filter: { source: { $eq: source } },
  });
}

export async function ingestBatch(
  documents: { text: string; topic: Topic; source: string }[]
): Promise<number> {
  let totalChunks = 0;
  for (const doc of documents) {
    const count = await ingestText(doc.text, doc.topic, doc.source);
    totalChunks += count;
  }
  return totalChunks;
}
