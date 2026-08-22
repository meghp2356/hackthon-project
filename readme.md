# GlobeTrotter

A premium, frontend-only travel-planning workspace built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui-compatible components.

## Local development

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run typecheck
npm run build
```

## Structure

- `src/app` contains route groups and route-level UI.
- `src/components` contains reusable application, feature, and shadcn/ui-compatible components.
- `src/features` contains client-side feature screens and interactions.
- `src/types` contains Zod schemas and domain types.
- `src/services` contains repository interfaces, mock implementations, and the future API client.
- `src/data` contains deterministic fixtures used only by mock repositories.

## Data mode and future API

The current application is intentionally frontend-only. Data flows through typed repositories, not directly from pages to fixtures. Replace the bindings in `src/services/repositories.ts` with REST-backed implementations when the API is ready. The expected contracts are documented in [docs/API-CONTRACT.md](docs/API-CONTRACT.md).

Set `NEXT_PUBLIC_API_BASE_URL` when enabling a future API implementation. Never expose database credentials or connect a browser directly to a database.
