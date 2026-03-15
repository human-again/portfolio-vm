import { getResumeBlobUrl } from "@/lib/portfolio/kv";

/**
 * GET /api/resume/download
 * Redirects to the active resume: Vercel Blob URL if available,
 * otherwise the static public PDF.
 */
export async function GET() {
  const blobUrl = await getResumeBlobUrl();

  if (blobUrl) {
    const url = new URL(blobUrl);
    url.searchParams.set("download", "1");
    return Response.redirect(url.toString(), 302);
  }

  // Fallback: redirect to the static public PDF
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://varunmahajan.tech";
  return Response.redirect(new URL("/resume/resume.pdf", baseUrl), 302);
}
