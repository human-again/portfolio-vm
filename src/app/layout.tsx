import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://varunmahajan.tech"),
  title: {
    default: "Varun Mahajan — Lead Experience Engineer | AI Portfolio",
    template: "%s | Varun Mahajan",
  },
  description:
    "Varun Mahajan — Lead Experience Engineer with 14+ years in Next.js, React, TypeScript, and Node.js. Toronto-based. Specializing in AI-powered web applications.",
  keywords: [
    "Varun Mahajan",
    "Lead Experience Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "AI Portfolio",
    "Toronto",
    "Frontend Engineer",
  ],
  authors: [{ name: "Varun Mahajan", url: "https://varunmahajan.tech" }],
  openGraph: {
    type: "website",
    url: "https://varunmahajan.tech",
    title: "Varun Mahajan — Lead Experience Engineer | AI Portfolio",
    description:
      "Chat with my AI portfolio — ask about my projects, skills, and experience.",
    images: [
      {
        url: "/images/vm-profile.png",
        width: 1200,
        height: 630,
        alt: "Varun Mahajan — Lead Experience Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Varun Mahajan — AI Portfolio",
    description:
      "Chat with my AI portfolio — ask about my projects, skills, and experience.",
    images: ["/images/vm-profile.png"],
  },
  alternates: { canonical: "https://varunmahajan.tech" },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Varun Mahajan",
  jobTitle: "Lead Experience Engineer",
  url: "https://varunmahajan.tech",
  image: "https://varunmahajan.tech/images/vm-profile.png",
  email: "mhjn.varun@gmail.com",
  address: { "@type": "PostalAddress", addressCountry: "CA", addressRegion: "Ontario" },
  sameAs: ["https://github.com/human-again"],
  knowsAbout: ["Next.js", "React", "TypeScript", "Node.js", "AI", "Kubernetes", "Docker"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="viewport-border">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
