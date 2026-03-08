import { ChatOllama } from "@langchain/ollama";
import type { LLMConfig, LLMProviderFactory } from "./types";

export class OllamaProvider implements LLMProviderFactory {
  createChatModel(config: LLMConfig) {
    return new ChatOllama({
      model: config.model,
      temperature: config.temperature,
      baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    });
  }
}
