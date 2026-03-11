import { Suspense } from "react";
import type { Metadata } from "next";
import { getPortfolioData } from "@/lib/portfolio/merged";
import ChatContent from "@/components/chat/ChatContent";

export const metadata: Metadata = {
  title: "Chat with Varun's AI",
  description: "Ask about Varun Mahajan's projects, skills, experience, and more.",
  alternates: { canonical: "/chat" },
};

export default async function ChatPage() {
  const data = await getPortfolioData();

  return (
    <Suspense
      fallback={
        <div role="status" aria-label="Loading" className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      }
    >
      <ChatContent data={data} />
    </Suspense>
  );
}
