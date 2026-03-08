"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Loader2 } from "lucide-react";
import type { Topic } from "@/data/portfolio";

const TOPICS: { value: Topic; label: string }[] = [
  { value: "projects", label: "Projects" },
  { value: "skills", label: "Skills" },
  { value: "resume", label: "Resume" },
  { value: "fun", label: "Fun" },
  { value: "contact", label: "Contact" },
  { value: "general", label: "General" },
];

export default function DocumentUploader({
  onUploadComplete,
}: {
  onUploadComplete: () => void;
}) {
  const [topic, setTopic] = useState<Topic>("general");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setUploading(true);
      setError(null);

      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("topic", topic);

        try {
          const res = await fetch("/api/admin/documents", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Upload failed");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Upload failed");
        }
      }

      setUploading(false);
      onUploadComplete();
    },
    [topic, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/markdown": [".md"],
      "text/plain": [".txt"],
    },
    disabled: uploading,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Topic:</label>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value as Topic)}
          className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background"
        >
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-foreground/40 bg-muted"
            : "border-border hover:border-foreground/20"
        } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Processing...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={24} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? "Drop files here..."
                : "Drag & drop files here, or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF, Markdown, and Text files
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
