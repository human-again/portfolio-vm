import pdfParse from "pdf-parse";
import { readFile } from "fs/promises";
import path from "path";

export async function parsePDF(filePath: string): Promise<string> {
  const buffer = await readFile(filePath);
  const data = await pdfParse(buffer);
  return data.text;
}

export async function parseMarkdown(filePath: string): Promise<string> {
  const content = await readFile(filePath, "utf-8");
  return content;
}

export async function parseText(filePath: string): Promise<string> {
  const content = await readFile(filePath, "utf-8");
  return content;
}

export async function parseFile(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".pdf":
      return parsePDF(filePath);
    case ".md":
    case ".markdown":
      return parseMarkdown(filePath);
    case ".txt":
      return parseText(filePath);
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}
