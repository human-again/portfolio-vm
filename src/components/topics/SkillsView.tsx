import { Layers } from "lucide-react";

interface SkillsData {
  frontend: string[];
  backend: string[];
  devops: string[];
  ai: string[];
}

function SkillBadge({ skill }: { skill: string }) {
  return (
    <span className="inline-block px-3 py-1.5 text-sm font-medium rounded-full bg-foreground text-background">
      {skill}
    </span>
  );
}

function SkillCategory({ title, skills }: { title: string; skills: string[] }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Layers size={16} className="text-muted-foreground" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <ul className="flex flex-wrap gap-2" aria-label={`${title} skills`}>
        {skills.map((skill) => (
          <li key={skill}>
            <SkillBadge skill={skill} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SkillsView({ skills }: { skills: SkillsData }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Skills & Expertise</h2>
      <SkillCategory title="Frontend" skills={skills.frontend} />
      <SkillCategory title="Backend" skills={skills.backend} />
      <SkillCategory title="DevOps & Infrastructure" skills={skills.devops} />
      <SkillCategory title="AI & Machine Learning" skills={skills.ai} />
    </div>
  );
}
