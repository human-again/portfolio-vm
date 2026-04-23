"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProjectData } from "@/lib/portfolio/merged";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface Props {
  projects: ProjectData[];
}

// Derive the set of unique labels for filter pills
function getLabels(projects: ProjectData[]): string[] {
  const seen = new Set<string>();
  const labels: string[] = [];
  for (const p of projects) {
    if (!seen.has(p.label)) {
      seen.add(p.label);
      labels.push(p.label);
    }
  }
  return labels;
}

export default function ProjectsView({ projects }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [startIndex, setStartIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const visibleCount = 3;

  const labels = getLabels(projects);
  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.label === activeFilter);

  // Reset to page 0 whenever the filter changes
  useEffect(() => {
    setStartIndex(0);
  }, [activeFilter]);

  const canGoBack = startIndex > 0;
  const canGoForward = startIndex + visibleCount < filtered.length;

  const visibleProjects = filtered.slice(startIndex, startIndex + visibleCount);

  // Pagination display: e.g. "1–3 of 5"
  const pageStart = filtered.length === 0 ? 0 : startIndex + 1;
  const pageEnd = Math.min(startIndex + visibleCount, filtered.length);

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-4">My Projects</h2>

      {/* Filter pills */}
      {labels.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {["All", ...labels].map((label) => (
            <button
              key={label}
              onClick={() => setActiveFilter(label)}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
                activeFilter === label
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Project cards */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">No projects match this filter.</p>
      ) : (
        <>
          <div className="flex gap-4 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleProjects.map((project) => (
                <motion.button
                  key={project.name}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  onClick={() => setSelectedProject(project)}
                  aria-label={`View details for ${project.name}`}
                  className="flex-1 min-w-[160px] rounded-2xl bg-gradient-to-b from-white to-muted border border-border p-5 shadow-sm text-left hover:shadow-md hover:border-foreground/20 transition-all cursor-pointer flex flex-col gap-3"
                >
                  {/* Label + name */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{project.label}</p>
                    <p className="text-lg font-bold text-foreground leading-snug">{project.name}</p>
                  </div>

                  {/* Outcome teaser */}
                  {project.outcome && (
                    <p className="text-xs text-muted-foreground italic leading-relaxed line-clamp-2">
                      {project.outcome}
                    </p>
                  )}

                  {/* Tech tags (first 3) */}
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-[10px] rounded-full bg-muted border border-border text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-muted border border-border text-muted-foreground">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination row */}
          {filtered.length > visibleCount && (
            <div className="flex items-center justify-end gap-3 mt-4">
              <span className="text-xs text-muted-foreground">
                {pageStart}–{pageEnd} of {filtered.length}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setStartIndex((i) => Math.max(0, i - 1))}
                  disabled={!canGoBack}
                  aria-label="Previous projects"
                  className="p-1 rounded-full text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                <button
                  onClick={() =>
                    setStartIndex((i) =>
                      Math.min(filtered.length - visibleCount, i + 1)
                    )
                  }
                  disabled={!canGoForward}
                  aria-label="Next projects"
                  className="p-1 rounded-full text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail drawer */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailDrawer
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Detail drawer ───────────────────────────────────────────────────────────

function ProjectDetailDrawer({
  project,
  onClose,
}: {
  project: ProjectData;
  onClose: () => void;
}) {
  const prefersReduced = useReducedMotion();
  const titleId = `project-drawer-${project.name.replace(/\s+/g, "-")}`;
  const drawerRef = useFocusTrap<HTMLDivElement>(true);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [handleEscape]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/30 z-40"
        initial={prefersReduced ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={prefersReduced ? {} : { opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <motion.div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-50 shadow-xl overflow-y-auto flex flex-col"
        initial={prefersReduced ? {} : { x: "100%" }}
        animate={{ x: 0 }}
        exit={prefersReduced ? {} : { x: "100%" }}
        transition={
          prefersReduced
            ? { duration: 0 }
            : { type: "spring", damping: 25, stiffness: 200 }
        }
      >
        <div className="p-6 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              {project.label}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Close project details"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {/* Title + period */}
          <h2 id={titleId} className="text-2xl font-bold text-foreground mb-1">
            {project.name}
          </h2>
          {project.period && (
            <p className="text-sm text-muted-foreground mb-6">{project.period}</p>
          )}

          <div className="space-y-6 flex-1">
            {/* About */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                About
              </h3>
              <p className="text-foreground leading-relaxed">{project.description}</p>
            </section>

            {/* Role */}
            {project.role && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  My Role
                </h3>
                <p className="text-foreground leading-relaxed">{project.role}</p>
              </section>
            )}

            {/* Technologies */}
            {project.technologies.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm rounded-full bg-foreground text-background"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Impact */}
            {project.outcome && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Impact
                </h3>
                <p className="text-foreground leading-relaxed">{project.outcome}</p>
              </section>
            )}
          </div>

          {/* Footer links */}
          {project.githubUrl && (
            <div className="flex gap-3 mt-8 pt-6 border-t border-border">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-border hover:border-foreground/40 hover:bg-muted transition-all"
              >
                <Github size={15} aria-hidden="true" />
                View on GitHub
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
