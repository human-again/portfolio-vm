"use client";

import Link from "next/link";
import { Briefcase, Layers, Sparkles, Users, FileText, Smile } from "lucide-react";
import { portfolio } from "@/data/portfolio";

const topics = [
  { label: "Projects", icon: Briefcase, query: portfolio.topicQueries.projects },
  { label: "Skills", icon: Layers, query: portfolio.topicQueries.skills },
  { label: "Fun", icon: Sparkles, query: portfolio.topicQueries.fun },
  { label: "Contact", icon: Users, query: portfolio.topicQueries.contact },
  { label: "Resume", icon: FileText, query: portfolio.topicQueries.resume },
];

export default function TopicNav() {
  return (
    <nav aria-label="Topic navigation">
      <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {topics.map((topic) => (
          <Link
            key={topic.label}
            href={`/chat?query=${encodeURIComponent(topic.query)}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-border bg-white hover:bg-muted transition-colors text-sm whitespace-nowrap shrink-0"
          >
            <topic.icon size={14} className="text-muted-foreground" aria-hidden="true" />
            <span className="font-medium text-foreground">{topic.label}</span>
          </Link>
        ))}
        <button
          aria-label="More topics"
          className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-white hover:bg-muted transition-colors shrink-0"
        >
          <Smile size={16} className="text-muted-foreground" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
