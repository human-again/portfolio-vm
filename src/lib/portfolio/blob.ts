import { put } from "@vercel/blob";

/**
 * Upload a PDF to Vercel Blob storage using private access.
 * The store (vm-portfolio-blob) is private — all blobs require the
 * BLOB_READ_WRITE_TOKEN to read. The /api/resume/download route proxies
 * the file by fetching it server-side with the token.
 *
 * Does NOT set the global resume KV key —
 * use updateConfig() separately when setting the active resume.
 */
export async function uploadPdfToBlob(
  filename: string,
  buffer: Buffer,
): Promise<string> {
  const blob = await put(`documents/${filename}`, buffer, {
    access: "private",
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return blob.url;
}
