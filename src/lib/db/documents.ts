import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import type { DocumentRecord } from "./types";

const DOCUMENTS_KEY = "documents";
const LOCAL_DB_PATH = resolve(
  process.env.VERCEL ? "/tmp" : process.cwd(),
  "src/data/documents.json"
);

function isKvConfigured(): boolean {
  return !!(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

async function getRedis() {
  const { Redis } = await import("@upstash/redis");
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    process.env.UPSTASH_REDIS_REST_URL = process.env.KV_REST_API_URL;
    process.env.UPSTASH_REDIS_REST_TOKEN = process.env.KV_REST_API_TOKEN;
  }
  return Redis.fromEnv();
}

async function readDB(): Promise<DocumentRecord[]> {
  if (isKvConfigured()) {
    try {
      const redis = await getRedis();
      const stored = await redis.get(DOCUMENTS_KEY);
      if (stored) return stored as DocumentRecord[];
    } catch (err) {
      console.warn("[Documents] KV read failed, falling back to local:", err);
    }
  }
  try {
    const data = await readFile(LOCAL_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeDB(docs: DocumentRecord[]): Promise<void> {
  if (isKvConfigured()) {
    try {
      const redis = await getRedis();
      await redis.set(DOCUMENTS_KEY, JSON.stringify(docs));
      return;
    } catch (err) {
      console.warn("[Documents] KV write failed, falling back to local:", err);
    }
  }
  await writeFile(LOCAL_DB_PATH, JSON.stringify(docs, null, 2));
}

export async function getAllDocuments(): Promise<DocumentRecord[]> {
  return readDB();
}

export async function addDocument(doc: DocumentRecord): Promise<void> {
  const docs = await readDB();
  docs.push(doc);
  await writeDB(docs);
}

export async function removeDocument(id: string): Promise<DocumentRecord | null> {
  const docs = await readDB();
  const index = docs.findIndex((d) => d.id === id);
  if (index === -1) return null;
  const [removed] = docs.splice(index, 1);
  await writeDB(docs);
  return removed;
}

export async function getDocumentById(id: string): Promise<DocumentRecord | null> {
  const docs = await readDB();
  return docs.find((d) => d.id === id) || null;
}
