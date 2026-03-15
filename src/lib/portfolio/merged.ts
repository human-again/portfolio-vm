import { portfolio } from "@/data/portfolio";
import { getPortfolioOverride } from "./kv";
import { getConfig } from "@/lib/db/config";
import type { PortfolioOverride } from "./types";

// ── Merged portfolio data type ──────────────────────────────────────────────

export interface ProjectData {
  name: string;
  label: string;
  description: string;
  technologies: string[];
  outcome: string;
  role: string;
  period: string;
}

export interface MergedPortfolioData {
  profile: {
    name: string;
    tagline: string;
    headline: string;
    avatar: string;
    watermarkText: string;
    bio: string;
    availability: string;
  };
  projects: ProjectData[];
  skills: {
    frontend: string[];
    backend: string[];
    devops: string[];
    ai: string[];
  };
  contact: {
    email: string;
    phone: string;
  };
  resume: {
    fullName: string;
    description: string;
    filename: string;
    url: string;
    updatedAt: string;
    fileSize: string;
  };
  fun: {
    heading: string;
    subtitle: string;
    photos: string[];
  };
  experience: Array<{
    role: string;
    company: string;
    period: string;
    description: string;
    technologies: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    period: string;
    notes: string;
  }>;
  certifications: string[];
  funFacts: string[];
  hobbies: string[];
  /** true when KV override is active */
  isOverridden: boolean;
  /** ISO timestamp of when extraction happened, or null */
  extractedAt: string | null;
}

// ── Main accessor ───────────────────────────────────────────────────────────

/**
 * Returns merged portfolio data: KV override wins when available,
 * static portfolio.ts is the fallback.
 *
 * This is the single source of truth for all UI components and the system prompt.
 */
export async function getPortfolioData(): Promise<MergedPortfolioData> {
  const [override, config] = await Promise.all([
    getPortfolioOverride(),
    getConfig(),
  ]);

  // When an active resume is set, point the download card to the API endpoint.
  // It reads the document's blobUrl from Redis and redirects to Vercel Blob.
  // Falls back to static /resume/resume.pdf when no active resume is configured.
  const activeResumeUrl = config.activeResumeId ? "/api/resume/download" : null;

  if (override) {
    return buildFromOverride(override, activeResumeUrl);
  }
  return buildFromStatic(activeResumeUrl);
}

// ── Internal builders ───────────────────────────────────────────────────────

function buildFromOverride(
  o: PortfolioOverride,
  activeResumeUrl: string | null,
): MergedPortfolioData {
  return {
    profile: {
      name: o.profile.name,
      tagline: o.profile.tagline ?? portfolio.profile.tagline,
      headline: o.profile.headline ?? portfolio.profile.headline,
      avatar: portfolio.profile.avatar,
      watermarkText: portfolio.profile.watermarkText,
      bio: o.profile.bio,
      availability: o.profile.availability,
    },
    projects: o.projects.map((p) => ({
      name: p.name,
      label: p.label ?? "Project",
      description: p.description,
      technologies: p.technologies ?? [],
      outcome: p.outcome ?? "",
      role: p.role ?? "",
      period: p.period ?? "",
    })),
    skills: {
      frontend: o.skills.frontend.length
        ? o.skills.frontend
        : portfolio.skills.frontend,
      backend: o.skills.backend.length
        ? o.skills.backend
        : portfolio.skills.backend,
      devops: o.skills.devops.length
        ? o.skills.devops
        : portfolio.skills.devops,
      ai: o.skills.ai.length ? o.skills.ai : portfolio.skills.ai,
    },
    contact: {
      email: o.contact.email,
      phone: o.contact.phone ?? portfolio.contact.phone,
    },
    resume: {
      fullName: o.resume?.fullName ?? portfolio.resume.fullName,
      description: o.resume?.description ?? portfolio.resume.description,
      filename: o.resume?.filename ?? portfolio.resume.filename,
      url: activeResumeUrl ?? o.resume?.url ?? portfolio.resume.url,
      updatedAt: o.resume?.updatedAt ?? portfolio.resume.updatedAt,
      fileSize: o.resume?.fileSize ?? portfolio.resume.fileSize,
    },
    fun: portfolio.fun,
    experience: o.experience,
    education: o.education,
    certifications: o.certifications,
    funFacts: o.funFacts.length ? o.funFacts : portfolio.content.funFacts,
    hobbies: o.hobbies.length ? o.hobbies : portfolio.content.hobbies,
    isOverridden: true,
    extractedAt: o.extractedAt,
  };
}

function buildFromStatic(activeResumeUrl: string | null): MergedPortfolioData {
  return {
    profile: {
      ...portfolio.profile,
      bio: portfolio.content.bio,
      availability: portfolio.content.availability,
    },
    projects: portfolio.content.projectDetails.map((p) => ({
      name: p.name,
      label: "Project",
      description: p.description,
      technologies: p.technologies,
      outcome: p.outcome,
      role: "",
      period: "",
    })),
    skills: portfolio.skills,
    contact: portfolio.contact,
    resume: {
      ...portfolio.resume,
      url: activeResumeUrl ?? portfolio.resume.url,
    },
    fun: portfolio.fun,
    experience: portfolio.content.experience,
    education: portfolio.content.education,
    certifications: portfolio.content.certifications,
    funFacts: portfolio.content.funFacts,
    hobbies: portfolio.content.hobbies,
    isOverridden: false,
    extractedAt: null,
  };
}
