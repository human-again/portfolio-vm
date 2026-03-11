import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Varun Mahajan — AI Portfolio",
    short_name: "VM Portfolio",
    description:
      "Lead Experience Engineer with 14+ years in Next.js, React, and TypeScript. Chat with my AI portfolio.",
    theme_color: "#f97066",
    background_color: "#ffffff",
    display: "standalone",
    start_url: "/",
    icons: [
      {
        src: "/images/vm-profile.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
