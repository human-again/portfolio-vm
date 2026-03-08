import { ChatAnthropic } from "@langchain/anthropic";
import type { LLMConfig, LLMProviderFactory } from "./types";

export class AnthropicProvider implements LLMProviderFactory {
  createChatModel(config: LLMConfig) {
    return new ChatAnthropic({
      model: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
}
