import { FileText, Download } from "lucide-react";

interface ResumeData {
  fullName: string;
  description: string;
  url: string;
  updatedAt: string;
  fileSize: string;
}

export default function ResumeView({ resume }: { resume: ResumeData }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Resume</h2>
      <a
        href={resume.url}
        download
        aria-label={`Download ${resume.fullName} resume as PDF`}
        className="flex items-center gap-4 rounded-2xl bg-muted p-6 hover:bg-muted/80 transition-colors group"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-background">
          <FileText size={20} className="text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-foreground">{resume.fullName}</p>
          <p className="text-sm text-muted-foreground truncate">{resume.description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF &middot; Updated {resume.updatedAt} &middot; {resume.fileSize}
          </p>
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground text-background group-hover:bg-foreground/80 transition-colors shrink-0">
          <Download size={18} aria-hidden="true" />
        </div>
      </a>
      <p className="text-center text-sm text-muted-foreground mt-3">
        Click to download the resume
      </p>
    </div>
  );
}
