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

function loadConfig(overrides?: Partial<LLMConfig>): LLMConfig {
  return {
    provider: (overrides?.provider || process.env.LLM_PROVIDER || "ollama") as LLMProviderName,
    model: overrides?.model || process.env.LLM_MODEL || "llama3.2",
    temperature: overrides?.temperature ?? parseFloat(process.env.LLM_TEMPERATURE || "0.7"),
    maxTokens: overrides?.maxTokens ?? parseInt(process.env.LLM_MAX_TOKENS || "1024", 10),
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
