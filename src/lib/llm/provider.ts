import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { LLMConfig, LLMProviderName, LLMProviderFactory } from "./types";
import { OllamaProvider } from "./ollama";
import { OpenAIProvider } from "./openai";
import { AnthropicProvider } from "./anthropic";
import { GroqProvider } from "./groq";

const PROVIDER_REGISTRY: Record<LLMProviderName, LLMProviderFactory> = {
  ollama: new OllamaProvider(),
  openai: new OpenAIProvider(),
  anthropic: new AnthropicProvider(),
  groq: new GroqProvider(),
};

export async function loadConfigAsync(): Promise<Partial<LLMConfig>> {
  // Try to read from KV (admin settings)
  try {
    const { getConfig } = await import("@/lib/db/config");
    const config = await getConfig();
    return {
      provider: config.llmProvider as LLMProviderName | undefined,
      model: config.llmModel,
      temperature: config.llmTemperature,
      maxTokens: config.llmMaxTokens,
    };
  } catch {
    // Silently fail if KV is not available
  }
  return {};
}

function buildConfig(overrides?: Partial<LLMConfig>, kvConfig?: Partial<LLMConfig>): LLMConfig {
  // Priority: overrides > KV config (admin settings) > env vars > defaults
  return {
    provider: (overrides?.provider || kvConfig?.provider || process.env.LLM_PROVIDER || "ollama") as LLMProviderName,
    model: overrides?.model || kvConfig?.model || process.env.LLM_MODEL || "llama3.2",
    temperature: overrides?.temperature ?? parseFloat(process.env.LLM_TEMPERATURE || String(kvConfig?.temperature ?? 0.7)),
    maxTokens: overrides?.maxTokens ?? parseInt(process.env.LLM_MAX_TOKENS || String(kvConfig?.maxTokens ?? 1024), 10),
  };
}

export async function createLLMAsync(overrides?: Partial<LLMConfig>): Promise<BaseChatModel> {
  const kvConfig = await loadConfigAsync();
  const config = buildConfig(overrides, kvConfig);
  const factory = PROVIDER_REGISTRY[config.provider];
  if (!factory) {
    throw new Error(`Unknown LLM provider: ${config.provider}`);
  }
  return factory.createChatModel(config);
}

// Sync version for backwards compatibility (uses env vars and defaults)
export function createLLM(overrides?: Partial<LLMConfig>): BaseChatModel {
  const config = buildConfig(overrides);
  const factory = PROVIDER_REGISTRY[config.provider];
  if (!factory) {
    throw new Error(`Unknown LLM provider: ${config.provider}`);
  }
  return factory.createChatModel(config);
}
