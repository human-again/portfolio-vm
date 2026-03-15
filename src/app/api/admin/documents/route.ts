import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getAllDocuments, addDocument, removeDocument, getDocumentById } from "@/lib/db/documents";
import { ingestDocument, deleteBySource } from "@/lib/rag/pipeline";
import { writeFile, mkdir, unlink } from "fs/promises";
import { resolve } from "path";
import { v4 as uuidv4 } from "uuid";
import type { Topic } from "@/data/portfolio";

const UPLOADS_DIR = resolve(process.env.VERCEL ? "/tmp" : process.cwd(), "data/uploads");

export async function GET() {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const docs = await getAllDocuments();
  return Response.json(docs);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const topic = formData.get("topic") as Topic | null;

  if (!file || !topic) {
    return Response.json({ error: "File and topic are required" }, { status: 400 });
  }

  const id = uuidv4();
  const source = `upload-${id}`;

  await mkdir(UPLOADS_DIR, { recursive: true });
  const filePath = resolve(UPLOADS_DIR, `${id}-${file.name}`);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  try {
    const chunkCount = await ingestDocument({ filePath, topic, source });

    // Upload PDFs to Vercel Blob for persistent storage
    let blobUrl: string | undefined;
    if (file.type === "application/pdf" && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { uploadResumeToBlob } = await import("@/lib/portfolio/blob");
        blobUrl = await uploadResumeToBlob(file.name, buffer);
        console.log("[Blob] PDF uploaded:", blobUrl);
      } catch (err) {
        console.warn("[Blob] PDF upload failed (non-fatal):", err);
      }
    }

    await addDocument({
      id,
      filename: file.name,
      topic,
      source,
      uploadedAt: new Date().toISOString(),
      chunkCount,
      fileSize: file.size,
      blobUrl,
    });

    const ragEnabled = !!process.env.PINECONE_API_KEY && !!process.env.OPENAI_API_KEY;
    return Response.json({ id, chunkCount, ragEnabled, blobUrl });
  } catch (err) {
    await unlink(filePath).catch(() => {});
    console.error("Document ingestion error:", err);
    return Response.json({ error: "Failed to process document" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return Response.json({ error: "Document ID is required" }, { status: 400 });
  }

  const doc = await getDocumentById(id);
  if (!doc) {
    return Response.json({ error: "Document not found" }, { status: 404 });
  }

  try {
    await deleteBySource(doc.source);
  } catch (err) {
    console.warn("Failed to delete vectors:", err);
  }

  await removeDocument(id);

  const filePath = resolve(UPLOADS_DIR, `${id}-${doc.filename}`);
  await unlink(filePath).catch(() => {});

  return Response.json({ success: true });
}
