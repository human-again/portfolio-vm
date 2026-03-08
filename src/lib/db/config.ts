import type { AppConfig } from "./types";

const CONFIG_KEY = "app-config";

const DEFAULT_CONFIG: AppConfig = {
  llmProvider: process.env.LLM_PROVIDER || "ollama",
  llmModel: process.env.LLM_MODEL || "llama3.2",
  llmTemperature: Number(process.env.LLM_TEMPERATURE) || 0.7,
  llmMaxTokens: Number(process.env.LLM_MAX_TOKENS) || 1024,
};

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
        return { ...DEFAULT_CONFIG, ...(stored as Partial<AppConfig>) };
      }
    } catch (err) {
      console.warn("[Config] KV read failed, using defaults:", err);
    }
  }

  // Fallback to env vars and defaults
  return DEFAULT_CONFIG;
}

export async function updateConfig(updates: Partial<AppConfig>): Promise<AppConfig> {
  const current = await getConfig();
  const updated = { ...current, ...updates };

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
