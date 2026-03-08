"use client";

import { motion } from "framer-motion";
import ProfileHero from "@/components/home/ProfileHero";
import TopicCards from "@/components/home/TopicCards";
import ChatInput from "@/components/chat/ChatInput";
import InfoButton from "@/components/chat/InfoButton";
import { portfolio } from "@/data/portfolio";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8 relative">
      <InfoButton />

      <div className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-2xl">
        <ProfileHero />
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <ChatInput variant="home" />
        </motion.div>
        <TopicCards />
      </div>

      {/* Watermark */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[8rem] md:text-[12rem] font-bold text-foreground/[0.04] tracking-wider leading-none">
          {portfolio.profile.watermarkText}
        </span>
      </div>
    </main>
  );
}
