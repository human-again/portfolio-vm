import { put } from "@vercel/blob";

/**
 * Upload a PDF to Vercel Blob storage.
 * Returns the public blob URL. Does NOT set the global resume KV key —
 * use updateConfig() separately when setting the active resume.
 */
export async function uploadPdfToBlob(
  filename: string,
  buffer: Buffer,
): Promise<string> {
  const blob = await put(`documents/${filename}`, buffer, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}
