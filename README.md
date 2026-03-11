# AI Portfolio Chat

A modern, AI-powered portfolio built with **Next.js 16 App Router**. Visitors can ask an LLM questions about your experience, skills, and projects — powered by portfolio context injected directly into the system prompt. No vector DB required for the base setup.

## Features

- **AI Chat Interface** — Streaming chat powered by Ollama, OpenAI, Anthropic, or Groq (factory pattern via LangChain)
- **Three-Tier Context Fallback** — Upstash Redis KV → uploaded PDFs → static `portfolio.ts`
- **Admin Panel** — Protected dashboard for uploading resumes, running LLM extraction, and configuring the LLM provider
- **Resume PDF Extraction** — LLM parses uploaded PDFs into structured portfolio data (Zod-validated), stored in Redis KV
- **Optional RAG** — Pluggable vector search via Pinecone or Upstash Vector (see `docs/RAG-UPGRADE.md`)
- **Security hardened** — Rate limiting, input validation, security headers, admin route protection
- **WCAG 2.1 AA** — Skip nav, semantic HTML, SR announcements, keyboard-navigable
- **SEO ready** — JSON-LD, OpenGraph, Twitter cards, sitemap, robots.txt, canonical URLs
- **Responsive** — Tailwind CSS v4 + Framer Motion animations

## Architecture

### Data Flow

Three-tier fallback cascade managed by `src/lib/portfolio/merged.ts`:

1. **Upstash Redis KV override** — structured data extracted from resume via LLM (`portfolio-override` key)
2. **Uploaded PDF text** — raw document text from `data/uploads/` (legacy path)
3. **Static `src/data/portfolio.ts`** — hardcoded fallback, always works with zero config

`getPortfolioData()` is the single source of truth consumed by all UI components and the system prompt.

### Chat / LLM System

- **`POST /api/chat`** — receives `{ query }` (max 2000 chars), rate-limited to 20 req/min per IP, classifies topic via keyword heuristics, streams SSE response
- **LLM Provider** — factory in `src/lib/llm/provider.ts`; configured via `LLM_PROVIDER` + `LLM_MODEL` env vars, with KV override from the admin settings panel
- **System Prompt** — `src/lib/prompts/system.ts` builds a Staff Engineer/EM persona with portfolio context + topic-specific focus instructions
- **LangGraph** — `src/lib/graph/` defines a state-machine workflow (topicRouter → retriever → contextFormatter → llmResponder) for the optional RAG-enhanced flow

### Admin Panel

- **Auth** — NextAuth v5 credentials provider (`src/auth.ts`); validates against `ADMIN_PASSWORD` env var; middleware in `src/proxy.ts` protects all `/admin/*` routes
- **Routes** — `/admin` (dashboard), `/admin/documents` (upload/manage PDFs), `/admin/settings` (LLM config)
- **Resume Extraction** — `POST /api/admin/extract` parses a PDF with an LLM, validates output with Zod, writes to Upstash Redis KV
- **Blob Storage** — Resume PDFs optionally stored in Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set

### Security

| Layer | Implementation |
|-------|----------------|
| Rate limiting | 20 req/min per IP on `/api/chat` (`src/lib/utils/rateLimit.ts`) |
| Input validation | 2000-char max on query; type checked on every request |
| Security headers | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` (via `next.config.ts`) |
| Admin auth | NextAuth v5 session cookie; checked in both middleware and every API handler |
| Secrets | All credentials via env vars only — never hardcoded in source |

See [SECURITY.md](SECURITY.md) for the vulnerability reporting policy.

### Server / Client Boundary

- **Server Components** — `src/app/chat/page.tsx` fetches `getPortfolioData()` server-side and passes props down. Admin pages fetch auth + data server-side.
- **Client Components** — Homepage, all chat UI (`src/components/chat/`), admin forms. Topic views (`src/components/topics/`) are pure presentational.

## Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
pnpm install
```

### 2. Set Up Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

**Minimum for local dev** (requires [Ollama](https://ollama.com) running locally):
```env
LLM_PROVIDER=ollama
LLM_MODEL=llama3.2
```

**For cloud LLM providers** (pick one):
```env
LLM_PROVIDER=groq
LLM_MODEL=llama-3.3-70b-versatile
GROQ_API_KEY=your_key          # free tier — console.groq.com

# or:
LLM_PROVIDER=openai
OPENAI_API_KEY=your_key

# or:
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_key
```

**For portfolio data persistence + admin** (optional but recommended):
```env
UPSTASH_REDIS_REST_URL=         # upstash.com — free tier
UPSTASH_REDIS_REST_TOKEN=
BLOB_READ_WRITE_TOKEN=          # Vercel Blob — for resume PDF storage
ADMIN_PASSWORD=your_strong_password
AUTH_SECRET=                    # generate: npx auth secret
```

**For RAG / vector search** (optional — see `docs/RAG-UPGRADE.md`):
```env
PINECONE_API_KEY=
UPSTASH_VECTOR_REST_URL=
UPSTASH_VECTOR_REST_TOKEN=
JINA_API_KEY=
```

### 3. Customize Your Portfolio

1. Update **`src/data/portfolio.ts`** — profile, projects, skills, experience, contact, resume details
2. Replace **`public/images/`** — add your own avatar and fun photos
3. Update **`public/llms.txt`** — AI-readable summary of your portfolio (used by LLM crawlers)
4. Update **`public/resume/resume.pdf`** — your actual resume PDF

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.

## Commands

```bash
pnpm dev          # Start Next.js dev server on port 3000
pnpm build        # Production build (type-checks before bundling)
pnpm lint         # ESLint — Next.js core web vitals + TypeScript rules
pnpm seed         # Populate vector store from src/data/seed/ markdown files
pnpm tsc --noEmit # Type check without emitting
```

## Key File Map

| Path | Purpose |
|------|---------|
| `src/data/portfolio.ts` | **Start here** — all your personal content |
| `src/lib/portfolio/merged.ts` | Single source of truth for portfolio data |
| `src/lib/prompts/system.ts` | System prompt builder (Staff Engineer persona) |
| `src/lib/llm/provider.ts` | LLM factory (Ollama / OpenAI / Anthropic / Groq) |
| `src/lib/utils/rateLimit.ts` | In-memory rate limiter for `/api/chat` |
| `src/app/api/chat/route.ts` | Chat SSE endpoint |
| `src/app/api/admin/extract/route.ts` | Resume PDF → structured data via LLM |
| `src/data/config.json` | Persisted LLM settings (provider, model, active resume) |
| `src/data/documents.json` | Uploaded document metadata registry |
| `docs/RAG-UPGRADE.md` | Zero-cost RAG upgrade path (Jina + Upstash Vector) |

## Conventions

- **Package manager**: pnpm (workspace configured, approves esbuild)
- **Path alias**: `@/*` → `./src/*`
- **Styling**: Tailwind CSS v4 with CSS-variable theme (`--color-accent: #f97066`)
- **Validation**: Zod schemas for all KV data and LLM extraction output
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Graceful degradation**: All KV/Blob features silently no-op when env vars are absent

## Deploy on Vercel

1. Push your fork to GitHub
2. Import the repository at [vercel.com/new](https://vercel.com/new)
3. Add all required environment variables in the Vercel dashboard
4. Deploy — Vercel auto-detects Next.js

> **Production tip:** Set `LLM_PROVIDER=groq` and `LLM_MODEL=llama-3.3-70b-versatile` in Vercel env vars — Groq's free tier handles ~14K requests/day with a 128K context window.

## Contributing

Contributions are welcome. Please open an issue first for significant changes.

To report a security vulnerability, see [SECURITY.md](SECURITY.md).

## License

MIT — see [LICENSE](LICENSE).
