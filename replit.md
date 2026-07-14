# Taanga-Taanga Publishers Ltd

A lean, high-conversion book discovery and inquiry site for a small Zambian local-language press (Kiikaonde and Tonga/Chitonga titles), plus a custom admin panel for a single non-technical admin.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/taanga-taanga run dev` — run the frontend (port 20446)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `SESSION_SECRET` — cookie session secret (already set)
- Optional env: `ADMIN_EMAIL` (default: `admin@taangataanga.com`)
- Optional env: `ADMIN_PASSWORD` (default: `admin-change-me` — change this in production)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, Wouter routing
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Auth: Cookie-session (simple email/password admin — credentials from env vars)

## Where things live

- `artifacts/taanga-taanga/` — React + Vite frontend (public site + admin panel)
- `artifacts/api-server/` — Express API server
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/api-client-react/src/generated/` — Generated React Query hooks
- `lib/api-zod/src/generated/` — Generated Zod validation schemas
- `lib/db/src/schema/` — Drizzle ORM schema (authors.ts, books.ts, inquiries.ts)

## Architecture decisions

- **Discovery-to-inquiry only** — no e-commerce, no checkout. Primary conversion is the inquiry form.
- **Single admin user** — auth uses ADMIN_EMAIL + ADMIN_PASSWORD env vars with cookie-session. No signup, no forgot password, by design.
- **Inquiries are persisted** — stored in the `inquiries` table even though the brief says "email only"; email sending is a future addition.
- **Slugs are auto-generated** — books and authors get slugs from their titles/names + timestamp on creation; slugs are never shown in admin forms.
- **Visual system is deliberately quiet** — no saturated colors in chrome; all color energy comes from book cover images.

## Product

- Public site: Homepage, Catalog (with filters), Book Detail, Author Page, Bulk Ordering page, Inquiry Form, About/Contact
- Admin panel: Login, Dashboard (stats), Book List/Add/Edit, Author List/Add/Edit

## User preferences

- Visual references provided are illustrative only — where they conflict with Section 6 of the brief (Corrections), the brief is authoritative.
- Footer must have exactly 3 columns: Sales/Bulk Orders, Press/Media, General Contact.
- All content aligns to the same left margin as the site header.
- No saturated colors in site chrome — book covers are the only visual energy.

## Gotchas

- After schema changes, run `pnpm run typecheck:libs` before `pnpm --filter @workspace/api-server run typecheck` or imports from `@workspace/db` will show false errors.
- After OpenAPI spec changes, run codegen before using updated types.
- The `cookie-session` middleware stores session in a signed cookie — if `SESSION_SECRET` changes, all admin sessions are invalidated.
- Admin default password is `admin-change-me` — set `ADMIN_PASSWORD` env var in production.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
