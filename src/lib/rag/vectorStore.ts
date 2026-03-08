import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

let pineconeClient: Pinecone | null = null;
let vectorStore: PineconeStore | null = null;

function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
      throw new Error("PINECONE_API_KEY is not set");
    }
    pineconeClient = new Pinecone({ apiKey });
  }
  return pineconeClient;
}

function getEmbeddings(): OpenAIEmbeddings {
  return new OpenAIEmbeddings({
    model: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
    dimensions: Number(process.env.EMBEDDING_DIMENSIONS) || 1536,
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function getVectorStore(): Promise<PineconeStore> {
  if (!vectorStore) {
    const pc = getPineconeClient();
    const indexName = process.env.PINECONE_INDEX || "portfolio-chat";
    const index = pc.index(indexName);
    vectorStore = await PineconeStore.fromExistingIndex(getEmbeddings(), {
      pineconeIndex: index,
    });
  }
  return vectorStore;
}

export async function getPineconeIndex() {
  const pc = getPineconeClient();
  const indexName = process.env.PINECONE_INDEX || "portfolio-chat";
  return pc.index(indexName);
}

export { getEmbeddings };
