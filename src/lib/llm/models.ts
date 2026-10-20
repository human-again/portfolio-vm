import type { LLMProviderName } from "./types";

export const MODEL_SUGGESTIONS: Record<LLMProviderName, readonly string[]> = {
  ollama: ["llama3.2", "llama3.1", "mistral", "codellama"],
  openai: ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"],
  anthropic: ["claude-sonnet-4-20250514", "claude-haiku-4-20250414"],
  groq: ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"],
};

export const DEFAULT_MODELS: Record<LLMProviderName, string> = {
  ollama: MODEL_SUGGESTIONS.ollama[0],
  openai: MODEL_SUGGESTIONS.openai[0],
  anthropic: MODEL_SUGGESTIONS.anthropic[0],
  groq: MODEL_SUGGESTIONS.groq[0],
};

// Keep persisted admin settings working after providers retire model IDs.
const GROQ_MODEL_MIGRATIONS: Record<string, string> = {
  "llama-3.3-70b-versatile": "openai/gpt-oss-120b",
  "llama-3.1-8b-instant": "openai/gpt-oss-20b",
  "gemma2-9b-it": "openai/gpt-oss-20b",
  "qwen/qwen3.6-27b": "qwen/qwen3.8-27b",
};

export function getDefaultModel(provider: string): string {
  return DEFAULT_MODELS[provider as LLMProviderName] ?? DEFAULT_MODELS.ollama;
}

export function migrateDeprecatedModel(provider: string, model: string): string {
  if (provider !== "groq") return model;
  return GROQ_MODEL_MIGRATIONS[model] ?? model;
}
