import { ChatGroq } from "@langchain/groq";
import type { LLMConfig, LLMProviderFactory } from "./types";

export class GroqProvider implements LLMProviderFactory {
  createChatModel(config: LLMConfig) {
    return new ChatGroq({
      model: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
      apiKey: process.env.GROQ_API_KEY,
    });
  }
}
