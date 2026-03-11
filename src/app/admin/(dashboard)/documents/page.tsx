"use client";

import { useState, useEffect, useCallback } from "react";
import DocumentUploader from "@/components/admin/DocumentUploader";
import DocumentList from "@/components/admin/DocumentList";
import type { DocumentRecord } from "@/lib/db/types";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document and its embeddings?")) return;

    try {
      const res = await fetch("/api/admin/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchDocuments();
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Documents</h1>

      <div role="note" className="mb-6 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
        <span className="font-medium">RAG not active.</span> Files are stored locally but not embedded — the AI responds from the system prompt instead. See{" "}
        <code className="text-xs bg-amber-100 px-1 rounded">docs/RAG-UPGRADE.md</code> to enable vector search.
      </div>

      <div className="border border-border rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
        <DocumentUploader onUploadComplete={fetchDocuments} />
      </div>

      <div className="border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Uploaded Documents ({documents.length})
        </h2>
        {loading ? (
          <p role="status" className="text-muted-foreground text-sm">Loading...</p>
        ) : (
          <DocumentList documents={documents} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
