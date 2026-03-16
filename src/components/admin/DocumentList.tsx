"use client";

import { useState } from "react";
import { Trash2, FileText, Sparkles, Loader2, Check } from "lucide-react";
import type { DocumentRecord } from "@/lib/db/types";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function DocumentList({
  documents,
  onDelete,
}: {
  documents: DocumentRecord[];
  onDelete: (id: string) => void;
}) {
  const [extractingId, setExtractingId] = useState<string | null>(null);
  const [settingResumeId, setSettingResumeId] = useState<string | null>(null);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [extractResult, setExtractResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  async function handleExtract(docId: string) {
    setExtractingId(docId);
    setExtractResult(null);

    try {
      const res = await fetch("/api/admin/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: docId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setExtractResult({
          success: false,
          message: data.error || "Extraction failed",
        });
        return;
      }

      setExtractResult({
        success: true,
        message: `Extracted: ${data.summary.name} — ${data.summary.projectCount} projects, ${data.summary.experienceCount} roles, ${data.summary.skillCount} skills`,
      });
    } catch (err) {
      setExtractResult({
        success: false,
        message: err instanceof Error ? err.message : "Network error",
      });
    } finally {
      setExtractingId(null);
    }
  }

  async function handleSetActiveResume(docId: string, filename: string) {
    setSettingResumeId(docId);

    try {
      const res = await fetch("/api/admin/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: docId, filename }),
      });

      if (res.ok) {
        setActiveResumeId(docId);
      }
    } catch (err) {
      console.error("Failed to set active resume:", err);
    } finally {
      setSettingResumeId(null);
    }
  }

  if (documents.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-8 text-center">
        No documents uploaded yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {/* Extraction result banner */}
      {extractResult && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-lg px-4 py-3 text-sm ${
            extractResult.success
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {extractResult.message}
        </div>
      )}

      {documents.map((doc) => {
        const isPdf = doc.filename.toLowerCase().endsWith(".pdf");

        return (
          <div
            key={doc.id}
            className="flex items-center justify-between border border-border rounded-lg px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium">{doc.filename}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.topic} · {doc.chunkCount} chunks ·{" "}
                  {formatBytes(doc.fileSize)} ·{" "}
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                  {isPdf && (
                    <>
                      {" · "}
                      {doc.blobUrl ? (
                        <span className="text-green-600 font-medium">Blob ✓</span>
                      ) : (
                        <span className="text-yellow-600 font-medium">Local only</span>
                      )}
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Set as Active Resume button — for all PDFs */}
              {isPdf && (
                <button
                  onClick={() => handleSetActiveResume(doc.id, doc.filename)}
                  disabled={settingResumeId !== null}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeResumeId === doc.id
                      ? "bg-green-600 text-white"
                      : "bg-muted hover:bg-muted/80 text-foreground disabled:opacity-50"
                  }`}
                  title="Set this as the resume shown on the portfolio"
                >
                  {settingResumeId === doc.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : activeResumeId === doc.id ? (
                    <Check size={14} />
                  ) : (
                    <FileText size={14} />
                  )}
                  {activeResumeId === doc.id ? "Active Resume" : "Set as Resume"}
                </button>
              )}
              {/* Extract to Portfolio button — only for PDFs */}
              {isPdf && (
                <button
                  onClick={() => handleExtract(doc.id)}
                  disabled={extractingId !== null}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-foreground text-background hover:bg-foreground/80 disabled:opacity-50 transition-colors"
                  title="Extract structured data from this document and update the portfolio"
                >
                  {extractingId === doc.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  {extractingId === doc.id ? "Extracting…" : "Extract to Portfolio"}
                </button>
              )}
              <button
                onClick={() => onDelete(doc.id)}
                aria-label={`Delete ${doc.filename}`}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
