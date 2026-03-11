# AI Portfolio Chat

A modern, AI-powered portfolio website built with Next.js 16 App Router. Features an interactive chat interface where users can ask questions about your experience, skills, and projects — powered by LLMs with portfolio context injection.

## Features

- **AI Chat Interface**: Interactive chat powered by various LLM providers (Ollama, OpenAI, Anthropic, Groq)
- **Portfolio Context**: Structured data fallback with Redis KV override and PDF extraction capabilities
- **Admin Panel**: Secure admin interface for managing portfolio data and LLM settings
- **Responsive Design**: Built with Tailwind CSS and Framer Motion animations
- **RAG Support**: Optional vector search and retrieval-augmented generation
- **Multi-Provider LLM**: Factory pattern supporting multiple AI providers

## Architecture

### Overview
Next.js 16 App Router portfolio site with an AI chat interface. Users ask questions about the portfolio owner's experience, skills, and projects — an LLM responds using portfolio context injected into the system prompt.

### Data Flow (Portfolio Context)
Three-tier fallback cascade managed by `src/lib/portfolio/merged.ts`:
1. **Upstash Redis KV override** — structured data extracted from resume via LLM (`portfolio-override` key)
2. **Uploaded PDF text** — raw document text from `data/uploads/` (legacy path)
3. **Static `src/data/portfolio.ts`** — hardcoded fallback

`getPortfolioData()` is the single source of truth. All UI components and the system prompt consume its output (`MergedPortfolioData`). The `isOverridden` flag tells the system prompt builder which context source to use.

### Server/Client Boundary
- **Server Components**: `src/app/chat/page.tsx` fetches `getPortfolioData()` and passes it as props to the client `ChatContent` component. Admin pages fetch auth/data server-side.
- **Client Components**: Homepage (`page.tsx`), all chat UI (`src/components/chat/`), admin forms. Topic views (`src/components/topics/`) are pure presentational — they receive data as props, never import `portfolio.ts` directly.

### Chat/LLM System
- **API**: `POST /api/chat` receives `{ query }`, classifies topic via keyword heuristics (`src/lib/utils/topicClassifier.ts`), builds system prompt with portfolio context, streams response via SSE.
- **LLM Provider**: Factory pattern in `src/lib/llm/provider.ts` — supports Ollama, OpenAI, Anthropic, Groq via LangChain. Configured by `LLM_PROVIDER` and `LLM_MODEL` env vars.
- **System Prompt**: `src/lib/prompts/system.ts` — `getSystemPrompt(topic)` is async, builds Staff Engineer/EM persona with topic-specific focus instructions. Context priority: KV override > uploaded PDFs > static portfolio.
- **LangGraph**: `src/lib/graph/` defines a state-machine workflow (topicRouter → retriever → contextFormatter → llmResponder). Available for RAG-enhanced flow.

### Admin Panel
- **Auth**: NextAuth v5 credentials provider (`src/auth.ts`), validates against `ADMIN_PASSWORD` env var. Middleware in `src/proxy.ts` protects `/admin/*` routes.
- **Routes**: `/admin` (dashboard), `/admin/documents` (upload/manage), `/admin/settings` (LLM config).
- **Resume Extraction**: `POST /api/admin/extract` parses a PDF, calls LLM with structured JSON prompt, validates output with Zod (`src/lib/portfolio/types.ts`), writes to Upstash Redis KV.
- **Blob Storage**: Resume PDFs auto-upload to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set (`src/lib/portfolio/blob.ts`).

## Getting Started

### Fork and Clone
1. Fork this repository to your GitHub account
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

### Install Dependencies
This project uses pnpm as the package manager:
```bash
pnpm install
```

### Set Up Environment Variables
Create a `.env.local` file in the root directory and add the following variables:

**Minimum for local dev** (Ollama running locally):
```
LLM_PROVIDER=ollama
LLM_MODEL=llama3.2
```

**For cloud LLM providers** (set one):
```
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

**For portfolio extraction + blob storage** (optional):
```
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

**For admin auth** (optional):
```
ADMIN_PASSWORD=your_secure_admin_password
AUTH_SECRET=your_nextauth_secret
```

**For RAG/vector search** (optional):
```
PINECONE_API_KEY=your_pinecone_api_key
UPSTASH_VECTOR_REST_URL=your_upstash_vector_url
UPSTASH_VECTOR_REST_TOKEN=your_upstash_vector_token
JINA_API_KEY=your_jina_api_key
```

### Customize Your Portfolio
1. Update `src/data/portfolio.ts` with your personal information:
   - Profile details (name, tagline, avatar)
   - Projects, skills, experience
   - Contact information
   - Resume details

2. Replace placeholder images in `public/images/` with your own photos

3. Update the system prompt in `src/lib/prompts/system.ts` if needed

### Run the Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Commands

```bash
pnpm dev              # Start Next.js dev server on port 3000
pnpm build            # Production build (also runs type checking)
pnpm lint             # ESLint with Next.js core web vitals + TypeScript rules
pnpm seed             # Populate vector store from src/data/seed/ markdown files
tsc --noEmit          # Type check without emitting (no test framework configured)
```

## Environment Variables

See the "Set Up Environment Variables" section above for all required and optional environment variables.

## Conventions

- **Package manager**: pnpm (workspace configured, approves esbuild)
- **Path alias**: `@/*` maps to `./src/*`
- **Styling**: Tailwind CSS v4 with CSS-variable theme (accent color: `--color-accent: #f97066`)
- **Validation**: Zod schemas for all KV data and LLM extraction output
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **External packages**: `pdf-parse` and `pdfjs-dist` are marked as server external in `next.config.ts` to avoid Turbopack bundling issues
- All KV/Blob features silently degrade when env vars are absent — `isKvConfigured()` guard returns null instead of throwing

## Git Configuration

For commits to be accepted by Vercel, configure git with your account:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Deploy on Vercel

1. Push your changes to your forked repository
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
