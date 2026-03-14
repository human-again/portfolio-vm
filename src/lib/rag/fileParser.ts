import { readFile } from "fs/promises";
import path from "path";

export async function parsePDF(filePath: string): Promise<string> {
  // DOMMatrix polyfill: pdfjs-dist references it at module load time in Node.js
  if (typeof globalThis.DOMMatrix === "undefined") {
    // @ts-expect-error — minimal stub; pdfjs-dist uses it for transform math only
    globalThis.DOMMatrix = class DOMMatrix {
      a=1; b=0; c=0; d=1; e=0; f=0;
      m11=1; m12=0; m13=0; m14=0;
      m21=0; m22=1; m23=0; m24=0;
      m31=0; m32=0; m33=1; m34=0;
      m41=0; m42=0; m43=0; m44=1;
      is2D=true; isIdentity=true;
      constructor(_init?: number[] | string) {}
      static fromMatrix() { return new globalThis.DOMMatrix(); }
      multiply() { return this; }
      inverse() { return this; }
      translate() { return this; }
      scale() { return this; }
      rotate() { return this; }
      toString() { return `matrix(${this.a},${this.b},${this.c},${this.d},${this.e},${this.f})`; }
    };
  }
  const { PDFParse } = await import("pdf-parse");
  const buffer = await readFile(filePath);
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  const result = await parser.getText();
  return result.text;
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
