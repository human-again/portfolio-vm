import { getConfig } from "@/lib/db/config";
import { readFile } from "fs/promises";
import { resolve } from "path";

const UPLOADS_DIR = resolve(process.env.VERCEL ? "/tmp" : process.cwd(), "data/uploads");

/**
 * GET /api/resume/download
 * Serves the active uploaded resume PDF from disk.
 * Falls back to the static public PDF if no active resume is set.
 */
export async function GET() {
  const config = await getConfig();

  if (config.activeResumeId && config.activeResumeFilename) {
    const filePath = resolve(UPLOADS_DIR, `${config.activeResumeId}-${config.activeResumeFilename}`);
    try {
      const buffer = await readFile(filePath);
      return new Response(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${config.activeResumeFilename}"`,
          "Cache-Control": "no-store",
        },
      });
    } catch {
      // File not found (e.g. ephemeral /tmp cleared) — fall through to static
    }
  }

  // Fallback: redirect to the static public PDF
  return Response.redirect(new URL("/resume/resume.pdf", process.env.NEXT_PUBLIC_APP_URL || "https://varunmahajan.tech"), 302);
}
