import { config } from "dotenv";
import { resolve } from "path";
import { readFile } from "fs/promises";
import { ingestText } from "../src/lib/rag/pipeline";
import type { Topic } from "../src/data/portfolio";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

interface SeedDoc {
  file: string;
  topic: Topic;
  source: string;
}

const SEED_DOCS: SeedDoc[] = [
  { file: "src/data/seed/projects.md", topic: "projects", source: "seed-projects" },
  { file: "src/data/seed/skills.md", topic: "skills", source: "seed-skills" },
  { file: "src/data/seed/resume.md", topic: "resume", source: "seed-resume" },
  { file: "src/data/seed/fun.md", topic: "fun", source: "seed-fun" },
  { file: "src/data/seed/contact.md", topic: "contact", source: "seed-contact" },
];

async function seed() {
  console.log("Starting seed process...\n");

  if (!process.env.PINECONE_API_KEY) {
    console.error("Error: PINECONE_API_KEY is not set in .env.local");
    process.exit(1);
  }
  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY is not set in .env.local (needed for embeddings)");
    process.exit(1);
  }

  let totalChunks = 0;

  for (const doc of SEED_DOCS) {
    try {
      const filePath = resolve(process.cwd(), doc.file);
      const text = await readFile(filePath, "utf-8");

      console.log(`Ingesting ${doc.file} (topic: ${doc.topic})...`);
      const chunks = await ingestText(text, doc.topic, doc.source);
      totalChunks += chunks;
      console.log(`  → ${chunks} chunks indexed`);
    } catch (err) {
      console.error(`  Error ingesting ${doc.file}:`, err);
    }
  }

  console.log(`\nSeed complete! ${totalChunks} total chunks indexed.`);
}

seed().catch(console.error);
