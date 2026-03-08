"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

interface AIResponseProps {
  query: string;
}

export default function AIResponse({ query }: AIResponseProps) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setText("");
    setIsLoading(true);

    async function fetchResponse() {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          setText("Sorry, I couldn't generate a response right now.");
          setIsLoading(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                setIsLoading(false);
                return;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.token) {
                  setText((prev) => prev + parsed.token);
                }
              } catch {
                // skip malformed JSON
              }
            }
          }
        }
        setIsLoading(false);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setText("Sorry, I couldn't generate a response right now.");
        }
        setIsLoading(false);
      }
    }

    fetchResponse();
    return () => controller.abort();
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="text-foreground leading-relaxed"
    >
      {isLoading && !text && (
        <div className="flex items-center gap-1 py-2">
          <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      )}
      <div className="prose prose-sm max-w-none prose-p:my-2 prose-headings:mb-2 prose-headings:mt-4">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </div>
      {isLoading && text && (
        <span className="inline-block w-1.5 h-4 bg-foreground/60 ml-0.5 animate-pulse" />
      )}
    </motion.div>
  );
}
