"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProjectData } from "@/lib/portfolio/merged";

interface Props {
  projects: ProjectData[];
}

export default function ProjectsView({ projects }: Props) {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    null,
  );
  const visibleCount = 3;

  const canGoBack = startIndex > 0;
  const canGoForward = startIndex + visibleCount < projects.length;

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">My Projects</h2>
      <div className="flex gap-4 overflow-hidden">
        {projects
          .slice(startIndex, startIndex + visibleCount)
          .map((project) => (
            <button
              key={project.name}
              onClick={() => setSelectedProject(project)}
              className="flex-1 min-w-[180px] rounded-2xl bg-gradient-to-b from-white to-muted border border-border p-6 shadow-sm text-left hover:shadow-md hover:border-foreground/20 transition-all cursor-pointer"
            >
              <p className="text-xs text-muted-foreground mb-1">
                {project.label}
              </p>
              <h3 className="text-xl font-bold text-foreground">
                {project.name}
              </h3>
            </button>
          ))}
      </div>
      {projects.length > visibleCount && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setStartIndex((i) => Math.max(0, i - 1))}
            disabled={!canGoBack}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() =>
              setStartIndex((i) =>
                Math.min(projects.length - visibleCount, i + 1),
              )
            }
            disabled={!canGoForward}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-50 shadow-xl overflow-y-auto"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              {project.label}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {project.name}
          </h2>
          {project.period && (
            <p className="text-sm text-muted-foreground mb-6">
              {project.period}
            </p>
          )}

          <div className="space-y-6">
            {/* About */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                About
              </h3>
              <p className="text-foreground leading-relaxed">
                {project.description}
              </p>
            </section>

            {/* Role */}
            {project.role && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  My Role
                </h3>
                <p className="text-foreground leading-relaxed">
                  {project.role}
                </p>
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
                <p className="text-foreground leading-relaxed">
                  {project.outcome}
                </p>
              </section>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
