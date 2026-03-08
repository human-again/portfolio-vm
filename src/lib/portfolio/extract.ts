import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { createLLM } from "@/lib/llm/provider";
import { PortfolioOverrideSchema, type PortfolioOverride } from "./types";

const EXTRACTION_PROMPT = `You are a resume parser. Extract structured portfolio data from the resume text below.

Return ONLY valid JSON — no markdown fences, no explanation, no text before or after the JSON object.

Match this exact schema:

{
  "profile": {
    "name": "<full name>",
    "bio": "<2-3 sentence professional summary emphasising technical leadership, architecture decisions, and business outcomes>",
    "availability": "<current status and preferences, or empty string>"
  },
  "experience": [
    {
      "role": "<job title>",
      "company": "<company name>",
      "period": "<start – end>",
      "description": "<2-4 sentences emphasising: scope of ownership, team size led, architecture decisions made, and measurable business outcomes>",
      "technologies": ["<tech1>", "<tech2>"]
    }
  ],
  "projects": [
    {
      "name": "<project name>",
      "label": "<category: AI Project, Platform, SDK, eCommerce, B2B, Internal Tool, etc.>",
      "description": "<what it does and why it matters, 1-2 sentences>",
      "technologies": ["<tech1>", "<tech2>"],
      "outcome": "<measurable result or business impact>",
      "role": "<what this person specifically did: led architecture, managed team of N, built components, etc.>",
      "period": "<approximate timeframe>"
    }
  ],
  "skills": {
    "frontend": ["<skill1>"],
    "backend": ["<skill1>"],
    "devops": ["<skill1>"],
    "ai": ["<skill1>"]
  },
  "contact": {
    "email": "<email>",
    "phone": "<phone or empty string>"
  },
  "education": [
    {
      "degree": "<degree>",
      "school": "<institution>",
      "period": "<year or period>",
      "notes": "<additional notes like work authorisation>"
    }
  ],
  "certifications": [],
  "funFacts": [],
  "hobbies": [],
  "extractedAt": "<current ISO timestamp>"
}

IMPORTANT RULES:
- For each project, extract the person's specific ROLE separately from the project description.
- For "outcome", prefer quantitative metrics (percentages, user counts). If none exist, describe qualitative outcomes.
- Categorise skills accurately: React/Angular/Vue/CSS → frontend; Node/Express/databases → backend; Docker/K8s/CI-CD → devops; ML/LLM/embeddings → ai.
- Order experience from most recent to oldest.
- If information is ambiguous or missing, use an empty string rather than guessing.
- The bio should read like a Staff Engineer or Engineering Manager profile.
- extractedAt should be the current date/time in ISO 8601 format.`;

/**
 * Parse resume text with LLM and extract structured portfolio data.
 * Validates the output against the PortfolioOverride Zod schema.
 */
export async function extractPortfolioFromResume(
  resumeText: string,
): Promise<PortfolioOverride> {
  const llm = createLLM({
    temperature: 0.1,
    maxTokens: 4096,
  });

  const result = await llm.invoke([
    new SystemMessage(EXTRACTION_PROMPT),
    new HumanMessage(resumeText),
  ]);

  const content =
    typeof result.content === "string" ? result.content : "";

  // Strip markdown fences if the LLM wraps in ```json ... ```
  const cleaned = content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `LLM returned invalid JSON. First 300 chars: ${cleaned.slice(0, 300)}`,
    );
  }

  const validated = PortfolioOverrideSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error(
      `Extraction output failed validation: ${JSON.stringify(validated.error)}`,
    );
  }

  return validated.data;
}
