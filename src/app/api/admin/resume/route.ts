import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getDocumentById } from "@/lib/db/documents";
import { updateConfig } from "@/lib/db/config";
import { readFile } from "fs/promises";
import { resolve } from "path";

const UPLOADS_DIR = resolve(
  process.env.VERCEL ? "/tmp" : process.cwd(),
  "data/uploads",
);

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { documentId, filename } = await request.json();

  if (!documentId || !filename) {
    return Response.json(
      { error: "documentId and filename are required" },
      { status: 400 },
    );
  }

  const doc = await getDocumentById(documentId);
  if (!doc) {
    return Response.json({ error: "Document not found" }, { status: 404 });
  }

  try {
    await updateConfig({
      activeResumeId: documentId,
      activeResumeFilename: filename,
      activeResumeUpdatedAt: new Date().toISOString(),
    });

    // Upload to Vercel Blob so the download card serves this PDF
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const filePath = resolve(UPLOADS_DIR, `${doc.id}-${doc.filename}`);
        const buffer = await readFile(filePath);
        const { uploadResumeToBlob } = await import("@/lib/portfolio/blob");
        await uploadResumeToBlob(doc.filename, Buffer.from(buffer));
      } catch (blobErr) {
        console.warn("[Resume] Blob upload failed (non-fatal):", blobErr);
      }
    }

    return Response.json({ success: true, documentId, filename });
  } catch (err) {
    console.error("Failed to set active resume:", err);
    return Response.json(
      { error: "Failed to set active resume" },
      { status: 500 },
    );
  }
}
