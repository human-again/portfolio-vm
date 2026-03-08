import { ChatOpenAI } from "@langchain/openai";
import type { LLMConfig, LLMProviderFactory } from "./types";

export class OpenAIProvider implements LLMProviderFactory {
  createChatModel(config: LLMConfig) {
    return new ChatOpenAI({
      model: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
}
