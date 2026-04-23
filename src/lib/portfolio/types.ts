import { z } from "zod";

// ── Zod schemas for validating KV override data ────────────────────────────

export const ProjectOverrideSchema = z.object({
  name: z.string(),
  label: z.string().optional().default("Project"),
  description: z.string(),
  technologies: z.array(z.string()).optional().default([]),
  outcome: z.string().optional().default(""),
  role: z.string().optional().default(""),
  period: z.string().optional().default(""),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
});

export const ExperienceOverrideSchema = z.object({
  role: z.string(),
  company: z.string(),
  period: z.string(),
  description: z.string(),
  technologies: z.array(z.string()).optional().default([]),
});

export const EducationOverrideSchema = z.object({
  degree: z.string(),
  school: z.string(),
  period: z.string(),
  notes: z.string().optional().default(""),
});

export const SkillsOverrideSchema = z.object({
  frontend: z.array(z.string()).optional().default([]),
  backend: z.array(z.string()).optional().default([]),
  devops: z.array(z.string()).optional().default([]),
  ai: z.array(z.string()).optional().default([]),
});

export const ContactOverrideSchema = z.object({
  email: z.string(),
  phone: z.string().optional().default(""),
});

export const ResumeOverrideSchema = z.object({
  fullName: z.string(),
  description: z.string(),
  filename: z.string(),
  url: z.string(),
  updatedAt: z.string(),
  fileSize: z.string(),
});

export const ProfileOverrideSchema = z.object({
  name: z.string(),
  tagline: z.string().optional(),
  headline: z.string().optional(),
  bio: z.string(),
  availability: z.string().optional().default(""),
});

export const PortfolioOverrideSchema = z.object({
  profile: ProfileOverrideSchema,
  experience: z.array(ExperienceOverrideSchema),
  projects: z.array(ProjectOverrideSchema),
  skills: SkillsOverrideSchema,
  contact: ContactOverrideSchema,
  resume: ResumeOverrideSchema.optional(),
  education: z.array(EducationOverrideSchema).optional().default([]),
  certifications: z.array(z.string()).optional().default([]),
  funFacts: z.array(z.string()).optional().default([]),
  hobbies: z.array(z.string()).optional().default([]),
  extractedAt: z.string(),
});

export type PortfolioOverride = z.infer<typeof PortfolioOverrideSchema>;
export type ProjectOverride = z.infer<typeof ProjectOverrideSchema>;
export type ExperienceOverride = z.infer<typeof ExperienceOverrideSchema>;
