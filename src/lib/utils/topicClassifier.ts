import type { Topic } from "@/data/portfolio";

const TOPIC_KEYWORDS: Record<Topic, string[]> = {
  projects: ["project", "working on", "built", "portfolio", "app", "application", "work"],
  skills: ["skill", "tech", "stack", "language", "framework", "tool", "expertise", "proficien"],
  fun: ["hobby", "hobbies", "fun", "outside", "free time", "crazy", "interest", "personal"],
  contact: ["contact", "reach", "email", "phone", "connect", "hire", "get in touch"],
  resume: ["resume", "cv", "download", "experience", "background", "career"],
  general: [],
};

export function classifyTopic(query: string): Topic {
  const lower = query.toLowerCase();

  let bestTopic: Topic = "general";
  let bestScore = 0;

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (topic === "general") continue;
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic as Topic;
    }
  }

  return bestTopic;
}
