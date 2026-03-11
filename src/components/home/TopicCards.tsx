"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Layers, Sparkles, Users, FileText } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const topics = [
  {
    label: "Projects",
    icon: Briefcase,
    query: portfolio.topicQueries.projects,
  },
  {
    label: "Skills",
    icon: Layers,
    query: portfolio.topicQueries.skills,
  },
  {
    label: "Fun",
    icon: Sparkles,
    query: portfolio.topicQueries.fun,
  },
  {
    label: "Contact",
    icon: Users,
    query: portfolio.topicQueries.contact,
  },
  {
    label: "Resume",
    icon: FileText,
    query: portfolio.topicQueries.resume,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function TopicCards() {
  const prefersReduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const containerVariants = prefersReduced
    ? { hidden: {}, show: {} }
    : container;
  const itemVariants = prefersReduced
    ? { hidden: {}, show: {} }
    : item;

  return (
    <div className="relative">
      {/* Gradient blob — decorative, glows around cards on hover */}
      <motion.div
        aria-hidden="true"
        className="absolute -inset-12 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #ffd700 0%, #ff1493 35%, #00bfff 70%, #9370db 100%)",
          filter: "blur(40px)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          prefersReduced
            ? {}
            : hovered
            ? {
                opacity: 0.35,
                x: [0, -25, 15, -15, 0],
                y: [0, 35, -25, 15, 0],
              }
            : { opacity: 0, scale: 0.8 }
        }
        transition={
          prefersReduced
            ? { duration: 0 }
            : hovered
            ? { duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
            : { duration: 0.5 }
        }
      />

      <motion.div
        className="flex flex-wrap justify-center gap-3 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {topics.map((topic) => (
          <motion.div key={topic.label} variants={itemVariants}>
            <Link
              href={`/chat?query=${encodeURIComponent(topic.query)}`}
              className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl border border-border bg-white hover:bg-muted hover:scale-[1.03] transition-all duration-200 min-w-[100px]"
            >
              <topic.icon size={20} className="text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">
                {topic.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
