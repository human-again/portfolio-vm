import { Mail, Phone } from "lucide-react";

interface ContactData {
  email: string;
  phone: string;
}

export default function ContactView({ contact }: { contact: ContactData }) {
  return (
    <div>
      <div className="rounded-2xl bg-muted p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
        <div className="space-y-4">
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-3 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Mail size={18} className="text-muted-foreground" />
            <span>{contact.email}</span>
            <span className="text-muted-foreground">&rsaquo;</span>
          </a>
          <div className="flex items-center gap-3 text-foreground">
            <Phone size={18} className="text-muted-foreground" />
            <span>{contact.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
