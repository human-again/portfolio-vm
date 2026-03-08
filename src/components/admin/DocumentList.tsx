"use client";

import { useState } from "react";
import { Trash2, FileText, Sparkles, Loader2 } from "lucide-react";
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
              <FileText size={18} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{doc.filename}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.topic} · {doc.chunkCount} chunks ·{" "}
                  {formatBytes(doc.fileSize)} ·{" "}
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
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
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
