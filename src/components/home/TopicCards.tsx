"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Layers, Sparkles, Users, FileText } from "lucide-react";
import { portfolio } from "@/data/portfolio";

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
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {topics.map((topic) => (
        <motion.div key={topic.label} variants={item}>
          <Link
            href={`/chat?query=${encodeURIComponent(topic.query)}`}
            className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl border border-border bg-white hover:bg-muted hover:scale-[1.03] transition-all duration-200 min-w-[100px]"
          >
            <topic.icon size={20} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {topic.label}
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
