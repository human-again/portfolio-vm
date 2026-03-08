import { auth } from "@/auth";
import { getDocumentById } from "@/lib/db/documents";
import { parseFile } from "@/lib/rag/fileParser";
import { extractPortfolioFromResume } from "@/lib/portfolio/extract";
import {
  setPortfolioOverride,
  getPortfolioOverride,
  deletePortfolioOverride,
} from "@/lib/portfolio/kv";
import { resolve } from "path";

const UPLOADS_DIR = resolve(process.cwd(), "data/uploads");

/**
 * POST /api/admin/extract
 * Body: { documentId: string }
 *
 * Parses the document, extracts structured portfolio data via LLM,
 * and writes the result to Upstash Redis (KV).
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { documentId } = await request.json();
  if (!documentId) {
    return Response.json(
      { error: "documentId is required" },
      { status: 400 },
    );
  }

  const doc = await getDocumentById(documentId);
  if (!doc) {
    return Response.json({ error: "Document not found" }, { status: 404 });
  }

  const filePath = resolve(UPLOADS_DIR, `${doc.id}-${doc.filename}`);

  let resumeText: string;
  try {
    resumeText = await parseFile(filePath);
  } catch (err) {
    console.error("[Extract] File parse error:", err);
    return Response.json(
      { error: "Failed to parse document" },
      { status: 500 },
    );
  }

  if (!resumeText.trim()) {
    return Response.json(
      { error: "Document has no extractable text" },
      { status: 400 },
    );
  }

  try {
    const extracted = await extractPortfolioFromResume(resumeText);
    await setPortfolioOverride(extracted);

    return Response.json({
      success: true,
      data: extracted,
      summary: {
        name: extracted.profile.name,
        projectCount: extracted.projects.length,
        experienceCount: extracted.experience.length,
        skillCount:
          extracted.skills.frontend.length +
          extracted.skills.backend.length +
          extracted.skills.devops.length +
          extracted.skills.ai.length,
      },
    });
  } catch (err) {
    console.error("[Extract] Extraction failed:", err);
    return Response.json(
      {
        error:
          err instanceof Error ? err.message : "Extraction failed",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/admin/extract
 * Returns the current KV override data, or null.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const override = await getPortfolioOverride();
  return Response.json({ override });
}

/**
 * DELETE /api/admin/extract
 * Removes the KV override, reverting all views to static portfolio.ts data.
 */
export async function DELETE() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await deletePortfolioOverride();
  return Response.json({ success: true });
}
