import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

export type LLMProviderName = "ollama" | "openai" | "anthropic" | "groq";

export interface LLMConfig {
  provider: LLMProviderName;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface LLMProviderFactory {
  createChatModel(config: LLMConfig): BaseChatModel;
}
