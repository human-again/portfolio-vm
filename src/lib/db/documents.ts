import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import type { DocumentRecord } from "./types";

const DB_PATH = resolve(process.cwd(), "src/data/documents.json");

async function readDB(): Promise<DocumentRecord[]> {
  try {
    const data = await readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeDB(docs: DocumentRecord[]): Promise<void> {
  await writeFile(DB_PATH, JSON.stringify(docs, null, 2));
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
