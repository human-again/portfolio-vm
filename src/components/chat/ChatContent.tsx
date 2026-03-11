"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import TopicView from "@/components/chat/TopicView";
import AIResponse from "@/components/chat/AIResponse";
import TopicNav from "@/components/chat/TopicNav";
import ChatInput from "@/components/chat/ChatInput";
import InfoButton from "@/components/chat/InfoButton";
import { classifyTopic } from "@/lib/utils/topicClassifier";
import type { MergedPortfolioData } from "@/lib/portfolio/merged";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  data: MergedPortfolioData;
}

export default function ChatContent({ data }: Props) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const topic = classifyTopic(query);
  const prefersReduced = useReducedMotion();

  return (
    <main id="main-content" className="flex flex-col min-h-screen px-4 py-4 sm:py-6">
      <h1 className="sr-only">{data.profile.name} — AI Portfolio Chat</h1>
      <InfoButton />

      {/* Small avatar - clickable back to home */}
      <motion.div
        className="flex justify-center mb-4 sm:mb-6"
        initial={prefersReduced ? {} : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={prefersReduced ? { duration: 0 } : { duration: 0.3 }}
      >
        <Link href="/" aria-label="Return to home">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden relative hover:opacity-80 transition-opacity">
            <Image
              src={data.profile.avatar}
              alt={data.profile.name}
              fill
              className="object-cover"
            />
          </div>
        </Link>
      </motion.div>

      {/* Topic-specific rich UI component */}
      <div className="w-full max-w-2xl mx-auto mb-6 sm:mb-8">
        <TopicView topic={topic} data={data} />
      </div>

      {/* AI-generated text response */}
      <div className="w-full max-w-2xl mx-auto mb-6 sm:mb-8">
        <AIResponse query={query} />
      </div>

      {/* Spacer to push nav + input to bottom when content is short */}
      <div className="flex-1" />

      {/* Topic navigation buttons */}
      <div className="w-full max-w-2xl mx-auto mb-3 sm:mb-4">
        <TopicNav />
      </div>

      {/* Chat input */}
      <div className="w-full max-w-2xl mx-auto pb-4">
        <ChatInput variant="chat" />
      </div>
    </main>
  );
}
