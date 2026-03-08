import { getAllDocuments } from "@/lib/db/documents";
import { getConfig } from "@/lib/db/config";
import { FileText, Cpu, Database } from "lucide-react";

export default async function AdminDashboard() {
  const [docs, config] = await Promise.all([getAllDocuments(), getConfig()]);

  const totalChunks = docs.reduce((sum, d) => sum + d.chunkCount, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText size={20} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Documents</span>
          </div>
          <p className="text-3xl font-bold">{docs.length}</p>
        </div>

        <div className="border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Database size={20} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Embedded Chunks
            </span>
          </div>
          <p className="text-3xl font-bold">{totalChunks}</p>
        </div>

        <div className="border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Cpu size={20} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Active Provider
            </span>
          </div>
          <p className="text-3xl font-bold capitalize">{config.llmProvider}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {config.llmModel}
          </p>
        </div>
      </div>

      <div className="border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Documents</h2>
        {docs.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No documents uploaded yet. Go to the Documents page to upload your
            first document.
          </p>
        ) : (
          <div className="space-y-3">
            {docs.slice(-5).reverse().map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">{doc.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.topic} · {doc.chunkCount} chunks ·{" "}
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
