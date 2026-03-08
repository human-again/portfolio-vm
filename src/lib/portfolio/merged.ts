import { portfolio } from "@/data/portfolio";
import { getPortfolioOverride, getResumeBlobUrl } from "./kv";
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
  const override = await getPortfolioOverride();
  const blobUrl = await getResumeBlobUrl();

  if (override) {
    return buildFromOverride(override, blobUrl);
  }
  return buildFromStatic(blobUrl);
}

// ── Internal builders ───────────────────────────────────────────────────────

function buildFromOverride(
  o: PortfolioOverride,
  blobUrl: string | null,
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
      url: blobUrl ?? o.resume?.url ?? portfolio.resume.url,
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

function buildFromStatic(blobUrl: string | null): MergedPortfolioData {
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
      url: blobUrl ?? portfolio.resume.url,
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
