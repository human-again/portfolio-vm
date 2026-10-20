import type { AppConfig } from "./types";
import { getDefaultModel, migrateDeprecatedModel } from "@/lib/llm/models";

const CONFIG_KEY = "app-config";

function getDefaultProvider(): string {
  if (process.env.LLM_PROVIDER) return process.env.LLM_PROVIDER;
  if (process.env.GROQ_API_KEY) return "groq";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return "ollama";
}

const defaultProvider = getDefaultProvider();

const DEFAULT_CONFIG: AppConfig = {
  llmProvider: defaultProvider,
  llmModel: migrateDeprecatedModel(
    defaultProvider,
    process.env.LLM_MODEL || getDefaultModel(defaultProvider),
  ),
  llmTemperature: Number(process.env.LLM_TEMPERATURE) || 0.7,
  llmMaxTokens: Number(process.env.LLM_MAX_TOKENS) || 1024,
};

function normalizeConfig(config: AppConfig): AppConfig {
  return {
    ...config,
    llmModel: migrateDeprecatedModel(config.llmProvider, config.llmModel),
  };
}

function isKvConfigured(): boolean {
  return !!(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

async function getRedis() {
  const { Redis } = await import("@upstash/redis");

  // Map Vercel KV env vars to Upstash format if needed
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    // Vercel KV is Upstash under the hood
    process.env.UPSTASH_REDIS_REST_URL = process.env.KV_REST_API_URL;
    process.env.UPSTASH_REDIS_REST_TOKEN = process.env.KV_REST_API_TOKEN;
  }

  return Redis.fromEnv();
}

export async function getConfig(): Promise<AppConfig> {
  // Try KV first if configured
  if (isKvConfigured()) {
    try {
      const redis = await getRedis();
      const stored = await redis.get(CONFIG_KEY);
      if (stored) {
        return normalizeConfig({
          ...DEFAULT_CONFIG,
          ...(stored as Partial<AppConfig>),
        });
      }
    } catch (err) {
      console.warn("[Config] KV read failed, using defaults:", err);
    }
  }

  // Fallback to env vars and defaults
  return normalizeConfig(DEFAULT_CONFIG);
}

export async function updateConfig(updates: Partial<AppConfig>): Promise<AppConfig> {
  const current = await getConfig();
  // Trim string fields to prevent whitespace issues
  const sanitized: Partial<AppConfig> = {
    ...updates,
    ...(updates.llmModel && { llmModel: updates.llmModel.trim() }),
    ...(updates.llmProvider && { llmProvider: updates.llmProvider.trim() }),
  };
  const updated = normalizeConfig({ ...current, ...sanitized });

  // Try to store in KV if configured
  if (isKvConfigured()) {
    try {
      const redis = await getRedis();
      await redis.set(CONFIG_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn("[Config] KV write failed:", err);
    }
  }

  return updated;
}
