import { put } from "@vercel/blob";
import { setResumeBlobUrl } from "./kv";

/**
 * Upload a PDF to Vercel Blob storage.
 * Returns the public blob URL. Does NOT set the global resume KV key —
 * use setResumeBlobUrl() separately when setting the active resume.
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

/**
 * Upload a resume PDF to Vercel Blob AND set it as the active resume URL in KV.
 * @deprecated Use uploadPdfToBlob() + setResumeBlobUrl() separately.
 */
export async function uploadResumeToBlob(
  filename: string,
  buffer: Buffer,
): Promise<string> {
  const url = await uploadPdfToBlob(filename, buffer);
  await setResumeBlobUrl(url);
  return url;
}
