import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://varunmahajan.tech"),
  title: {
    default: "Varun Mahajan — Lead Engineer · AI & Full-Stack · React, Next.js, LangGraph, Python",
    template: "%s | Varun Mahajan",
  },
  description:
    "Varun Mahajan — Lead Engineer with 15+ years building AI-powered full-stack platforms. Specializing in agentic AI systems (LangGraph, LangChain), React, Next.js, TypeScript, and Python. Based in Ontario, Canada.",
  keywords: [
    "Varun Mahajan",
    "Lead Engineer",
    "Agentic AI",
    "LangGraph",
    "LangChain",
    "Next.js",
    "React",
    "TypeScript",
    "Python",
    "Full-Stack Engineer",
    "AI Portfolio",
    "Ontario",
    "Canada",
  ],
  authors: [{ name: "Varun Mahajan", url: "https://varunmahajan.tech" }],
  openGraph: {
    type: "website",
    url: "https://varunmahajan.tech",
    title: "Varun Mahajan — Lead Engineer · AI & Full-Stack · React, Next.js, LangGraph, Python",
    description:
      "Chat with my AI portfolio — ask about my projects, skills, and experience.",
    images: [
      {
        url: "/images/vm-profile.png",
        width: 1200,
        height: 630,
        alt: "Varun Mahajan — Lead Engineer · AI & Full-Stack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Varun Mahajan — Lead Engineer · AI & Full-Stack",
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
  jobTitle: "Lead Engineer",
  url: "https://varunmahajan.tech",
  image: "https://varunmahajan.tech/images/vm-profile.png",
  email: "mhjn.varun@gmail.com",
  address: { "@type": "PostalAddress", addressCountry: "CA", addressRegion: "Ontario" },
  sameAs: ["https://github.com/human-again", "https://www.linkedin.com/in/varun-mhjn/"],
  knowsAbout: ["Next.js", "React", "TypeScript", "Python", "LangGraph", "LangChain", "Node.js", "Agentic AI", "Kubernetes", "Docker"],
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
      </body>
    </html>
  );
}
