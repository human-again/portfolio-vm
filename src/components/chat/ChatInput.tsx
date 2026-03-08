"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUp } from "lucide-react";

interface ChatInputProps {
  variant?: "home" | "chat";
}

export default function ChatInput({ variant = "home" }: ChatInputProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/chat?query=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  const Icon = variant === "home" ? ArrowRight : ArrowUp;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 shadow-sm">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="How can I help you?"
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
        />
        <button
          type="submit"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-background hover:bg-foreground/80 transition-colors shrink-0"
        >
          <Icon size={16} />
        </button>
      </div>
    </form>
  );
}
