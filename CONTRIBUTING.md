# Contributing

Thanks for considering a contribution to `portfolio-vm`. This project is a public AI portfolio template and Varun Mahajan's live portfolio implementation, so contributions should keep both use cases in mind.

## What Fits

Good contributions include:

- Bug fixes for the portfolio UI, chat flow, admin panel, or deployment setup
- Documentation improvements that make setup and customization clearer
- Accessibility, SEO, and performance improvements
- Small feature improvements that keep the app focused on an AI-powered portfolio experience

Please open an issue before starting large UI redesigns, major architecture changes, provider rewrites, or changes that affect the public portfolio content.

## Local Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

For the smallest local setup, run Ollama locally and set:

```env
LLM_PROVIDER=ollama
LLM_MODEL=llama3.2
```

Cloud LLM providers, Redis KV, Blob storage, and vector search are optional. The app should degrade gracefully when those environment variables are not present.

## Development Workflow

1. Fork the repository or create a branch from `main`.
2. Keep changes focused on one issue or one clearly scoped improvement.
3. Follow the existing Next.js App Router, TypeScript, Tailwind CSS, and Zod patterns.
4. Do not commit secrets, `.env.local`, uploaded private documents, or generated local build output.
5. Update documentation when behavior, setup, or configuration changes.

## Checks Before Opening a PR

Run the relevant checks before opening a pull request:

```bash
pnpm lint
pnpm build
```

If a check cannot be run locally, note why in the pull request.

## Pull Requests

Pull requests are welcome for bugs, docs fixes, accessibility improvements, and small product improvements. For larger changes, please open an issue first so the direction can be discussed before implementation.

When opening a PR, include:

- A short summary of the change
- The checks you ran
- Screenshots or recordings for visible UI changes
- Any deployment or environment variable impact

## Security

Do not report security vulnerabilities in public issues. Follow the private reporting process in [SECURITY.md](SECURITY.md).
