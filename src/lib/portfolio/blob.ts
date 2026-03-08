import { put } from "@vercel/blob";
import { setResumeBlobUrl } from "./kv";

/**
 * Upload a resume PDF to Vercel Blob and store the URL in KV.
 * Returns the public blob URL.
 */
export async function uploadResumeToBlob(
  filename: string,
  buffer: Buffer,
): Promise<string> {
  const blob = await put(`resume/${filename}`, buffer, {
    access: "public",
    addRandomSuffix: false,
  });

  await setResumeBlobUrl(blob.url);
  return blob.url;
}
