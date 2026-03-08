import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Turbopack from bundling pdf-parse/pdfjs-dist — they rely on
  // native Node.js require and a web worker file that can't be bundled.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
};

export default nextConfig;
