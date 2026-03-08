"use client";

import { motion } from "framer-motion";
import ProjectsView from "@/components/topics/ProjectsView";
import SkillsView from "@/components/topics/SkillsView";
import FunView from "@/components/topics/FunView";
import ContactView from "@/components/topics/ContactView";
import ResumeView from "@/components/topics/ResumeView";
import type { Topic } from "@/data/portfolio";
import type { MergedPortfolioData } from "@/lib/portfolio/merged";

interface TopicViewProps {
  topic: Topic;
  data: MergedPortfolioData;
}

function TopicContent({ topic, data }: TopicViewProps) {
  switch (topic) {
    case "projects":
      return <ProjectsView projects={data.projects} />;
    case "skills":
      return <SkillsView skills={data.skills} />;
    case "fun":
      return <FunView fun={data.fun} />;
    case "contact":
      return <ContactView contact={data.contact} />;
    case "resume":
      return <ResumeView resume={data.resume} />;
    default:
      return null;
  }
}

export default function TopicView({ topic, data }: TopicViewProps) {
  if (topic === "general") return null;

  return (
    <motion.div
      key={topic}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <TopicContent topic={topic} data={data} />
    </motion.div>
  );
}
