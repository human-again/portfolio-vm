import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { LLMConfig, LLMProviderName, LLMProviderFactory } from "./types";
import { OllamaProvider } from "./ollama";
import { OpenAIProvider } from "./openai";
import { AnthropicProvider } from "./anthropic";
import { GroqProvider } from "./groq";
import { getDefaultModel, migrateDeprecatedModel } from "./models";

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

function getEnvironmentProvider(): LLMProviderName {
  if (process.env.LLM_PROVIDER) {
    return process.env.LLM_PROVIDER as LLMProviderName;
  }
  if (process.env.GROQ_API_KEY) return "groq";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return "ollama";
}

function buildConfig(overrides?: Partial<LLMConfig>, kvConfig?: Partial<LLMConfig>): LLMConfig {
  // Priority: overrides > KV config (admin settings) > env vars > defaults
  const provider = (overrides?.provider || kvConfig?.provider || getEnvironmentProvider()) as LLMProviderName;
  const model = migrateDeprecatedModel(
    provider,
    overrides?.model || kvConfig?.model || process.env.LLM_MODEL || getDefaultModel(provider),
  );

  return {
    provider,
    model,
    temperature: overrides?.temperature ?? parseFloat(process.env.LLM_TEMPERATURE || String(kvConfig?.temperature ?? 0.7)),
    maxTokens: overrides?.maxTokens ?? parseInt(process.env.LLM_MAX_TOKENS || String(kvConfig?.maxTokens ?? 1024), 10),
  };
}

function validateProviderConfig(config: LLMConfig): void {
  const requiredKeys: Partial<Record<LLMProviderName, string>> = {
    groq: "GROQ_API_KEY",
    openai: "OPENAI_API_KEY",
    anthropic: "ANTHROPIC_API_KEY",
  };
  const requiredKey = requiredKeys[config.provider];

  if (requiredKey && !process.env[requiredKey]) {
    throw new Error(`${requiredKey} is required when LLM_PROVIDER=${config.provider}`);
  }

  if (config.provider === "ollama" && process.env.VERCEL && !process.env.OLLAMA_BASE_URL) {
    throw new Error(
      "Ollama cannot use localhost on Vercel. Configure OLLAMA_BASE_URL or select a cloud LLM provider.",
    );
  }
}

export async function createLLMAsync(overrides?: Partial<LLMConfig>): Promise<BaseChatModel> {
  const kvConfig = await loadConfigAsync();
  const config = buildConfig(overrides, kvConfig);
  const factory = PROVIDER_REGISTRY[config.provider];
  if (!factory) {
    throw new Error(`Unknown LLM provider: ${config.provider}`);
  }
  validateProviderConfig(config);
  return factory.createChatModel(config);
}

// Sync version for backwards compatibility (uses env vars and defaults)
export function createLLM(overrides?: Partial<LLMConfig>): BaseChatModel {
  const config = buildConfig(overrides);
  const factory = PROVIDER_REGISTRY[config.provider];
  if (!factory) {
    throw new Error(`Unknown LLM provider: ${config.provider}`);
  }
  validateProviderConfig(config);
  return factory.createChatModel(config);
}
