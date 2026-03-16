import { getConfig } from "@/lib/db/config";
import { getDocumentById } from "@/lib/db/documents";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { resolve } from "path";

const UPLOADS_DIR = resolve(
  process.env.VERCEL ? "/tmp" : process.cwd(),
  "data/uploads"
);

/**
 * GET /api/resume/download
 * Dynamically fetches the active resume.
 * 1. Tries to serve the local file (works in local dev without Vercel Blob)
 * 2. Falls back to the Vercel Blob URL if local file is gone (e.g. Vercel ephemeral /tmp)
 * 3. Falls back to static public PDF if all else fails.
 */
export async function GET(request: Request) {
  try {
    const config = await getConfig();
    const activeResumeId = config.activeResumeId;

    if (activeResumeId) {
      const doc = await getDocumentById(activeResumeId);

      if (doc) {
        // 1. Try serving from local file system
        const localPath = resolve(UPLOADS_DIR, `${doc.id}-${doc.filename}`);
        if (existsSync(localPath)) {
          const fileBuffer = await readFile(localPath);
          return new Response(fileBuffer, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="${doc.filename}"`,
            },
          });
        }

        // 2. Fallback to Vercel Blob URL if local file is missing
        if (doc.blobUrl) {
          try {
            const headResponse = await fetch(doc.blobUrl, { method: "HEAD" });
            if (headResponse.ok) {
              const url = new URL(doc.blobUrl);
              url.searchParams.set("download", "1");
              return Response.redirect(url.toString(), 302);
            }
            console.warn(`[Resume Download] Blob URL returned ${headResponse.status} for doc ${doc.id}`);
          } catch (err) {
            console.warn("[Resume Download] Failed to verify blob URL", err);
          }
        } else {
          console.warn(
            `[Resume Download] Doc ${doc.id} has no blobUrl — re-upload the PDF with BLOB_READ_WRITE_TOKEN configured`
          );
        }
      } else {
        console.warn(`[Resume Download] activeResumeId "${activeResumeId}" not found in documents`);
      }
    }
  } catch (err) {
    console.error("[Resume Download] Error fetching dynamic resume:", err);
  }

  // 3. Fallback: redirect to the static public PDF.
  // Use request.url as the base so the domain is always correct — no env var needed.
  return Response.redirect(new URL("/resume/resume.pdf", request.url), 302);
}
