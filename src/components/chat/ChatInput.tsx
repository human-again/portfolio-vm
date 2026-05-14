"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUp } from "lucide-react";
import { portfolio } from "@/data/portfolio";

interface ChatInputProps {
  variant?: "home" | "chat";
}

export default function ChatInput({ variant = "home" }: ChatInputProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const submitQuery = (value: string) => {
    const trimmedQuery = value.trim();
    if (!trimmedQuery) return;

    router.push(`/chat?query=${encodeURIComponent(trimmedQuery)}`);
    setQuery("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery(query);
  };

  const Icon = variant === "home" ? ArrowRight : ArrowUp;
  const suggestions = portfolio.promptSuggestions;

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-foreground/20">
          <label htmlFor="chat-query" className="sr-only">
            Ask a question
          </label>
          <input
            id="chat-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="How can I help you?"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none focus-visible:outline-none text-sm"
          />
          <button
            type="submit"
            aria-label="Send message"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-background hover:bg-foreground/80 transition-colors shrink-0"
          >
            <Icon size={16} aria-hidden="true" />
          </button>
        </div>
      </form>

      <div
        className="mt-3 flex flex-wrap items-center justify-center gap-2 px-2"
        aria-label="Suggested questions"
      >
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Try asking
        </span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => submitQuery(suggestion)}
            className="rounded-full border border-border/80 bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:border-accent hover:text-accent-text"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
