import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getDocumentById } from "@/lib/db/documents";
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

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

  // Verify document exists
  const doc = await getDocumentById(documentId);
  if (!doc) {
    return Response.json({ error: "Document not found" }, { status: 404 });
  }

  try {
    const configPath = resolve(process.cwd(), "src/data/config.json");
    const configData = JSON.parse(await readFile(configPath, "utf-8"));

    // Store active resume document ID
    configData.activeResumeId = documentId;
    configData.activeResumeFilename = filename;
    configData.activeResumeUpdatedAt = new Date().toISOString();

    await writeFile(configPath, JSON.stringify(configData, null, 2));

    return Response.json({
      success: true,
      documentId,
      filename,
    });
  } catch (err) {
    console.error("Failed to set active resume:", err);
    return Response.json(
      { error: "Failed to set active resume" },
      { status: 500 },
    );
  }
}
