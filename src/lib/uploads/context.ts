import { getAllDocuments } from "@/lib/db/documents";
import { parseFile } from "@/lib/rag/fileParser";
import { resolve } from "path";

const UPLOADS_DIR = resolve(process.cwd(), "data/uploads");

/**
 * Reads all uploaded documents from disk and returns their combined text.
 * Returns an empty string if no documents have been uploaded.
 * Errors on individual files are silently skipped.
 */
export async function getUploadedDocumentsText(): Promise<string> {
  try {
    const docs = await getAllDocuments();
    if (docs.length === 0) return "";

    const parts: string[] = [];

    for (const doc of docs) {
      const filePath = resolve(UPLOADS_DIR, `${doc.id}-${doc.filename}`);
      try {
        const text = await parseFile(filePath);
        parts.push(`[Source: ${doc.filename} | topic: ${doc.topic}]\n${text.trim()}`);
      } catch {
        // File may have been deleted from disk — skip silently
      }
    }

    return parts.join("\n\n---\n\n");
  } catch {
    return "";
  }
}
