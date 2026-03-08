import { Suspense } from "react";
import { getPortfolioData } from "@/lib/portfolio/merged";
import ChatContent from "@/components/chat/ChatContent";

export default async function ChatPage() {
  const data = await getPortfolioData();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2">
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
