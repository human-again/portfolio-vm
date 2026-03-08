import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { LLMConfig, LLMProviderName, LLMProviderFactory } from "./types";
import { OllamaProvider } from "./ollama";
import { OpenAIProvider } from "./openai";
import { AnthropicProvider } from "./anthropic";
import { GroqProvider } from "./groq";
import { readFileSync } from "fs";
import { resolve } from "path";

const PROVIDER_REGISTRY: Record<LLMProviderName, LLMProviderFactory> = {
  ollama: new OllamaProvider(),
  openai: new OpenAIProvider(),
  anthropic: new AnthropicProvider(),
  groq: new GroqProvider(),
};

function loadConfig(overrides?: Partial<LLMConfig>): LLMConfig {
  let fileConfig: Partial<LLMConfig> = {};

  // Try to read from config.json (admin settings)
  try {
    const configPath = resolve(process.cwd(), "src/data/config.json");
    const configData = JSON.parse(readFileSync(configPath, "utf-8"));
    fileConfig = {
      provider: configData.llmProvider as LLMProviderName | undefined,
      model: configData.llmModel,
      temperature: configData.llmTemperature,
      maxTokens: configData.llmMaxTokens,
    };
  } catch {
    // Silently fail if config.json doesn't exist or is invalid
  }

  // Priority: overrides > env vars > config.json > defaults
  return {
    provider: (overrides?.provider || process.env.LLM_PROVIDER || fileConfig.provider || "ollama") as LLMProviderName,
    model: overrides?.model || process.env.LLM_MODEL || fileConfig.model || "llama3.2",
    temperature: overrides?.temperature ?? parseFloat(process.env.LLM_TEMPERATURE || String(fileConfig.temperature ?? 0.7)),
    maxTokens: overrides?.maxTokens ?? parseInt(process.env.LLM_MAX_TOKENS || String(fileConfig.maxTokens ?? 1024), 10),
  };
}

export function createLLM(overrides?: Partial<LLMConfig>): BaseChatModel {
  const config = loadConfig(overrides);
  const factory = PROVIDER_REGISTRY[config.provider];
  if (!factory) {
    throw new Error(`Unknown LLM provider: ${config.provider}`);
  }
  return factory.createChatModel(config);
}
