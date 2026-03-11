"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Settings, Home, LayoutDashboard } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/documents", label: "Documents", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminNav({ userName }: { userName?: string }) {
  const pathname = usePathname();

  return (
    <aside aria-label="Admin" className="w-64 border-r border-border bg-muted/50 p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
        <p className="text-sm text-muted-foreground mt-1">{userName ?? "Admin"}</p>
      </div>

      <nav aria-label="Admin navigation" className="space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-8">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
        >
          <Home size={18} aria-hidden="true" />
          Back to Portfolio
        </Link>
      </div>
    </aside>
  );
}
