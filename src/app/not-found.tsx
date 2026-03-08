import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
      <p className="text-muted-foreground mb-8">
        This page doesn&apos;t exist. Let&apos;s get you back home.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Go Home
      </Link>
    </main>
  );
}
