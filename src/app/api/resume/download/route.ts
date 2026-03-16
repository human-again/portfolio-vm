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

        // 2. Proxy from Vercel Blob (private store requires server-side fetch with token)
        if (doc.blobUrl) {
          try {
            const headers: HeadersInit = {};
            if (process.env.BLOB_READ_WRITE_TOKEN) {
              headers["Authorization"] = `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`;
            }
            const blobResponse = await fetch(doc.blobUrl, { headers });
            if (blobResponse.ok) {
              return new Response(blobResponse.body, {
                headers: {
                  "Content-Type": "application/pdf",
                  "Content-Disposition": `attachment; filename="${doc.filename}"`,
                  "Cache-Control": "no-store",
                },
              });
            }
            console.warn(`[Resume Download] Blob fetch returned ${blobResponse.status} for doc ${doc.id}`);
          } catch (err) {
            console.warn("[Resume Download] Failed to fetch blob", err);
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
