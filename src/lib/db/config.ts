import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import type { AppConfig } from "./types";

const CONFIG_PATH = resolve(process.cwd(), "src/data/config.json");

const DEFAULT_CONFIG: AppConfig = {
  llmProvider: process.env.LLM_PROVIDER || "ollama",
  llmModel: process.env.LLM_MODEL || "llama3.2",
  llmTemperature: Number(process.env.LLM_TEMPERATURE) || 0.7,
  llmMaxTokens: Number(process.env.LLM_MAX_TOKENS) || 1024,
};

export async function getConfig(): Promise<AppConfig> {
  try {
    const data = await readFile(CONFIG_PATH, "utf-8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function updateConfig(updates: Partial<AppConfig>): Promise<AppConfig> {
  const current = await getConfig();
  const updated = { ...current, ...updates };
  await writeFile(CONFIG_PATH, JSON.stringify(updated, null, 2));
  return updated;
}
