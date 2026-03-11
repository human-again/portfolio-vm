"use client";

import { useState } from "react";
import { Info, X, Github } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export default function InfoButton() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useFocusTrap<HTMLDivElement>(isOpen);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 p-1.5 rounded-full border border-border hover:bg-muted transition-colors"
        aria-label="How this site was made"
      >
        <Info size={18} className="text-muted-foreground" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-dialog-title"
            className="bg-background border border-border rounded-2xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-background border-b border-border flex items-center justify-between p-6">
              <h2 id="info-dialog-title" className="text-2xl font-bold">How This Site Was Made</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
                aria-label="Close dialog"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-2">Tech Stack</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <span className="font-medium text-foreground">Next.js 16</span> — App Router with server/client components</li>
                  <li>• <span className="font-medium text-foreground">TypeScript</span> — Type-safe codebase</li>
                  <li>• <span className="font-medium text-foreground">TailwindCSS v4</span> — Utility-first styling</li>
                  <li>• <span className="font-medium text-foreground">Framer Motion</span> — Smooth animations and drawer</li>
                  <li>• <span className="font-medium text-foreground">shadcn/ui</span> — Accessible component library</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">Data & Storage</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <span className="font-medium text-foreground">Upstash Redis</span> — Persistent portfolio data from resume extraction</li>
                  <li>• <span className="font-medium text-foreground">Vercel Blob</span> — Cloud storage for downloadable resume</li>
                  <li>• <span className="font-medium text-foreground">Zod</span> — Runtime schema validation for extracted data</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">AI & LLM</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <span className="font-medium text-foreground">LangChain</span> — LLM orchestration and prompting</li>
                  <li>• <span className="font-medium text-foreground">Groq / OpenAI / Anthropic</span> — Configurable LLM providers</li>
                  <li>• <span className="font-medium text-foreground">RAG</span> — Context-aware responses using portfolio & uploaded documents</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <span className="font-medium text-foreground">Resume Extraction</span> — Upload PDF, LLM parses into structured data, auto-updates portfolio</li>
                  <li>• <span className="font-medium text-foreground">Interactive Chat</span> — Ask about projects, skills, contact, experience — AI responds with portfolio context</li>
                  <li>• <span className="font-medium text-foreground">Project Details Drawer</span> — Click any project card to see role, impact, technologies</li>
                  <li>• <span className="font-medium text-foreground">Staff Engineer Persona</span> — AI voice emphasizes technical depth, leadership, business outcomes</li>
                  <li>• <span className="font-medium text-foreground">Admin Panel</span> — Upload documents, extract data, manage portfolio</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-2">Architecture Highlights</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <span className="font-medium text-foreground">Server Components</span> — Chat page fetches portfolio data server-side, passes to client</li>
                  <li>• <span className="font-medium text-foreground">Data Merge Layer</span> — Single source of truth: KV override → uploaded PDFs → static portfolio.ts</li>
                  <li>• <span className="font-medium text-foreground">Graceful Fallback</span> — Site works without Redis/Blob; features degrade gracefully</li>
                  <li>• <span className="font-medium text-foreground">NextAuth v5</span> — Secure admin authentication with Credentials provider</li>
                </ul>
              </section>
            </div>

            {/* Footer with GitHub Link */}
            <div className="sticky bottom-0 bg-background border-t border-border p-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Built with passion • Deployed on Vercel</p>
              <a
                href="https://github.com/human-again/portfolio-vm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background hover:bg-foreground/80 transition-colors font-medium"
              >
                <Github size={18} aria-hidden="true" />
                View on GitHub
                <span className="sr-only">(opens in new tab)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
