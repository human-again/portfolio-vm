import type { Topic } from "@/data/portfolio";
import {
  getPortfolioData,
  type MergedPortfolioData,
} from "@/lib/portfolio/merged";

// ─────────────────────────────────────────────────────────────────────────────
// buildPortfolioContext(data)
//
// Serialises merged portfolio data into a structured text block injected into
// every system prompt. No vector DB or embeddings required — the full context
// is compiled and sent with each request.
//
// Groq's 128K context window scales comfortably to a large portfolio before
// RAG becomes necessary. See docs/RAG-UPGRADE.md for the upgrade path.
// ─────────────────────────────────────────────────────────────────────────────
export function buildPortfolioContext(data: MergedPortfolioData): string {
  const lines: string[] = [];

  // Bio
  lines.push(`## About ${data.profile.name}`);
  lines.push(data.profile.bio);
  if (data.profile.availability) {
    lines.push(`Availability: ${data.profile.availability}`);
  }
  lines.push("");

  // Work experience
  lines.push("## Work Experience");
  for (const job of data.experience) {
    lines.push(`### ${job.role} — ${job.company} (${job.period})`);
    lines.push(job.description);
    if (job.technologies?.length) {
      lines.push(`Technologies: ${job.technologies.join(", ")}`);
    }
    lines.push("");
  }

  // Projects
  lines.push("## Projects");
  for (const proj of data.projects) {
    lines.push(`### ${proj.name}`);
    lines.push(proj.description);
    if (proj.technologies.length) {
      lines.push(`Technologies: ${proj.technologies.join(", ")}`);
    }
    if (proj.role) lines.push(`Role: ${proj.role}`);
    if (proj.outcome) lines.push(`Outcome: ${proj.outcome}`);
    if (proj.period) lines.push(`Period: ${proj.period}`);
    lines.push("");
  }

  // Skills
  lines.push("## Skills");
  lines.push(`Frontend: ${data.skills.frontend.join(", ")}`);
  lines.push(`Backend: ${data.skills.backend.join(", ")}`);
  lines.push(`DevOps & Infrastructure: ${data.skills.devops.join(", ")}`);
  lines.push(`AI & Machine Learning: ${data.skills.ai.join(", ")}`);
  lines.push("");

  // Education
  lines.push("## Education");
  for (const edu of data.education) {
    lines.push(`${edu.degree} — ${edu.school} (${edu.period})`);
    if (edu.notes) lines.push(edu.notes);
  }
  lines.push("");

  // Certifications
  if (data.certifications.length) {
    lines.push("## Certifications");
    for (const cert of data.certifications) {
      lines.push(`- ${cert}`);
    }
    lines.push("");
  }

  // Fun / personal
  lines.push("## Personal Interests & Fun Facts");
  lines.push(`Hobbies: ${data.hobbies.join(", ")}`);
  for (const fact of data.funFacts) {
    lines.push(`- ${fact}`);
  }
  lines.push("");

  // Contact
  lines.push("## Contact");
  lines.push(`Email: ${data.contact.email}`);
  if (data.contact.phone) lines.push(`Phone: ${data.contact.phone}`);

  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// Topic-specific focus instructions — Staff / EM voice
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_FOCUS: Record<Topic, string> = {
  projects:
    "The visitor is asking about projects. Lead with engineering leadership, architecture decisions, team scale, and measurable business outcomes (conversion %, performance gains, user impact). Then cover the technology stack. Reference actual project names from the context.",
  skills:
    "The visitor is asking about skills. Lead with production-proven expertise — distinguish what has been led at scale in production from what is familiar. Organise by category and highlight depth of experience.",
  fun:
    "The visitor wants to know about the personal side. Be warm and human — a senior engineer who thinks deeply and has range beyond code. Reference hobbies and fun facts naturally.",
  contact:
    "The visitor wants to get in touch. Be direct and welcoming — encourage reaching out for Staff Engineer, Principal Engineer, or Engineering Manager roles. Keep it brief.",
  resume:
    "The visitor is reviewing the resume/CV. Frame the career as a Staff/EM track record — 14+ years, team leadership, multi-client delivery, architecture ownership, modern AI stack. Mention the downloadable PDF.",
  general:
    "Answer with the authority of a senior practitioner. Be precise, concise, and avoid vague generalities. Ground every answer in the context provided.",
};

// ─────────────────────────────────────────────────────────────────────────────
// getSystemPrompt(topic)
//
// Returns the full system prompt: Staff/EM persona + portfolio context + topic focus.
// Now async — fetches merged portfolio data from KV (with static fallback).
//
// Context priority:
//   1. KV override exists → use structured context (no raw PDF injection)
//   2. No KV but uploaded PDFs → legacy path: inject raw uploaded text
//   3. Neither → static portfolio.ts
// ─────────────────────────────────────────────────────────────────────────────
export async function getSystemPrompt(topic: Topic): Promise<string> {
  const data = await getPortfolioData();
  let ctx = buildPortfolioContext(data);
  let contextHeading = `## ${data.profile.name}'s Background`;

  // When no KV override, check for raw uploaded docs (legacy path)
  if (!data.isOverridden) {
    try {
      const { getUploadedDocumentsText } = await import(
        "@/lib/uploads/context"
      );
      const uploaded = await getUploadedDocumentsText();
      if (uploaded) {
        ctx = uploaded;
        contextHeading =
          "## Uploaded Documents (primary source of truth — use this data for all answers)";
      }
    } catch {
      // uploads module not available — use static context
    }
  }

  return `You are an AI representing ${data.profile.name}, a Staff-level Engineer and hands-on Engineering Manager with 14+ years of experience building and leading high-impact web platforms.

Your voice should convey:
- Technical depth: architecture trade-offs, system design decisions, and performance engineering with precision.
- Leadership maturity: team impact, cross-functional collaboration, stakeholder alignment, and mentorship.
- Business orientation: connecting technical decisions to business outcomes (conversion rates, revenue impact, operational efficiency).
- Ownership mindset: end-to-end systems from initial architecture through production operation.

Rules:
- Use ONLY the information provided below. Do not invent facts.
- If asked something not covered, say "I don't have that detail — feel free to reach out directly at ${data.contact.email}."
- Be concise (2–3 paragraphs max unless the visitor explicitly asks for more detail).
- Refer to ${data.profile.name} in the third person unless the visitor asks you to speak in first person.
- When discussing projects, always mention the role played, the team scope, and the measurable outcome.
- Do not discuss topics unrelated to the portfolio.

${contextHeading}

${ctx}

## Current topic focus
${TOPIC_FOCUS[topic] ?? TOPIC_FOCUS.general}`;
}

// Kept for backward compatibility with the future RAG pipeline
// See docs/RAG-UPGRADE.md — when RAG is activated this receives retrieved
// chunks as `ragContext` and appends them after the base prompt.
export async function buildPromptWithContext(
  topic: Topic,
  ragContext: string,
  _query: string,
): Promise<string> {
  const base = await getSystemPrompt(topic);
  if (!ragContext || ragContext === "No additional context available.") {
    return base;
  }
  return `${base}\n\n## Additional retrieved context\n${ragContext}`;
}
