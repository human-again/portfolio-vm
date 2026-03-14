import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getDocumentById } from "@/lib/db/documents";
import { updateConfig } from "@/lib/db/config";

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

    return Response.json({ success: true, documentId, filename });
  } catch (err) {
    console.error("Failed to set active resume:", err);
    return Response.json({ error: "Failed to set active resume" }, { status: 500 });
  }
}
