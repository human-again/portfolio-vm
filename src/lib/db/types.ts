import type { Topic } from "@/data/portfolio";

export interface DocumentRecord {
  id: string;
  filename: string;
  topic: Topic;
  source: string;
  uploadedAt: string;
  chunkCount: number;
  fileSize: number;
}

export interface AppConfig {
  llmProvider: string;
  llmModel: string;
  llmTemperature: number;
  llmMaxTokens: number;
  activeResumeId?: string;
  activeResumeFilename?: string;
  activeResumeUpdatedAt?: string;
}
