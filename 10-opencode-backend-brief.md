# Taanga-Taanga Publishers Ltd — Backend + Migration Brief for Cursor
**Revision 3.** Supersedes all prior versions. Context: Replit built a conflicting backend (Express + PostgreSQL + custom cookie-session auth) and Replit credits are depleted, so it cannot continue. A Phase 1 discovery pass (via OpenCode) has already been completed and is summarized below — **do not repeat discovery, proceed directly to Phase 2 using the findings here.** SEO has since been confirmed as a real requirement, which adds a scoped Next.js migration to this phase (see Section 3).

---

## SECTION 1 — DISCOVERY FINDINGS (Already Completed, For Reference)

**Codebase:** Local at the existing Replit-exported project. No GitHub remote — only a Replit internal backup remote. Confirm current access method before starting.

**Backend as found:** Express 5 + PostgreSQL (Drizzle ORM) + cookie-session, mounted at `/api`. Routes: health, books, authors, inquiry, admin. Auth is a **plaintext env-var comparison** (`ADMIN_EMAIL`/`ADMIN_PASSWORD`, no hashing, no real provider) — confirmed weakness, must be fully replaced.

**Frontend as found:** React SPA using generated React Query hooks (`@workspace/api-client-react`) calling relative `/api/...` paths. All 13 pages (7 public + 6 admin) exist and are largely aligned with the design brief — footer trimmed correctly, margins consistent, admin auth UI has no signup/reset, inquiry toggle logic present. **This UI work should be preserved, not rebuilt.**

**Known bugs to fix during this pass (see Section 4 for priority order):**
- Draft books are publicly retrievable by slug and on author pages — **security issue, fix first**
- Admin book edit form is broken (`booksData?.books.find(...)` against what the corrected API returns as a flat array — verify against final response shape)
- Book detail author link points to `/authors/${authorId}` (numeric) instead of `/authors/${authorSlug}`
- Catalog is missing series filter, sort control, and pagination/load-more
- "You may also like" logic only filters by `language`; brief calls for `language` + `category`, boosted by shared `series`, excluding the current book
- No fallback UI if inquiry submission fails
- No image upload implementation anywhere — cover/photo fields are plain URL text inputs

**Confirmed decisions from discovery follow-up:**
- Inquiry persistence: **no Firestore write, email-only**, as originally specified — do not add a "safety-net" log unless explicitly requested later
- `contextBlurb`: keep it — it's already live on `books` and in the API contract, just wasn't listed in the original schema table. Add it to the formal Firestore schema now.
- Required fields: relax to match what's already built rather than retroactively over-constraining. Genuinely required: `title`, `slug`, `authorId`, `language`, `category`, `status`. Everything else (`synopsis`, `isbn`, `pageCount`, `publicationDate`, `series`, `seriesNumber`, `bio`, etc.) stays optional.
- IDs: **migrate to native Firestore string document IDs.** Do not build a fake numeric-counter layer to preserve `id: number` in the API response — update the frontend's TypeScript types from `number` to `string` and remove any numeric parsing/comparison on IDs (quick grep, not a redesign). IDs are opaque identifiers in practice; they don't need to be numbers.
- Inquiry `inquirerType` values: frontend/contract use `"school"` / `"individual"` (lowercase, no slash) — **keep these exact values at the API boundary.** Map internally to the branching email copy ("bulk pricing follow-up" vs. "order/shipping confirmation"), do not change the contract to match the brief's earlier "School/Institution" wording.

---

## SECTION 2 — GUIDING CONSTRAINT: PRESERVE THE API CONTRACT

Rebuild the existing endpoints — same paths, same HTTP methods (note: **PATCH**, not PUT, for updates), same JSON request/response shapes documented in the discovery report — on the correct architecture, rather than inventing a new API surface. This is the primary lever for keeping the frontend UI (already largely correct) from needing significant rework.

**Endpoints to preserve exactly** (full shapes are in the discovery report — treat that document as the authoritative contract reference):
`GET /api/books`, `GET /api/books/featured`, `GET /api/books/:slug`, `GET /api/authors`, `GET /api/authors/:slug`, `POST /api/inquiry`, `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/me`, `GET /api/admin/stats`, `GET/POST /api/admin/books`, `PATCH/DELETE /api/admin/books/:id`, `GET/POST /api/admin/authors`, `PATCH/DELETE /api/admin/authors/:id`.

**Auth cookie:** replicate `tt_session` (httpOnly, 7-day maxAge, `sameSite: lax`) using Firebase Admin SDK's `createSessionCookie`, so the existing login flow requires no frontend changes beyond pointing at the new backend.

---

## SECTION 3 — SCOPED NEXT.JS MIGRATION (New — SEO Requirement)

SEO is a confirmed real requirement, which the pure-SPA approach cannot satisfy (crawlers see an empty shell before client-side data fetching completes). The fix is a **scoped** migration — not a full rewrite.

**Convert to Next.js App Router with Server Components + ISR — these 6 pages only:**
Homepage, Catalog, Book Detail, Author Page, Bulk Ordering, About/Contact. These need real content present in server-rendered HTML for crawlability and social-share previews. Use `revalidate` intervals appropriate to content that changes a few times a year (e.g. `revalidate: 3600` or higher — err toward longer, this is not fast-changing content).

**Keep as client-rendered (`'use client'`) — no SSR needed, no SEO value:**
All 5 admin panel screens (Login, Dashboard, Book List, Book Form, Author Form) and the Inquiry Form. These can reuse the existing React Query hooks and component logic essentially unchanged — just ported into the Next.js project structure with the client directive.

**What is portable as-is (do not rebuild):**
- All UI components (cards, buttons, forms, badges, toggles) — the visual system Cursor already built matches the design brief and should carry over directly
- Tailwind/styling configuration — minor config changes only
- Admin panel and Inquiry Form logic/hooks — copy over with `'use client'`, unchanged

**What requires real rework:**
- Data fetching on the 6 public pages: convert from client-side React Query hooks firing post-load, to server-side fetches in Server Components pulling from Firestore/the new API directly, with ISR revalidation
- Navigation: React Router (`Link`, `useNavigate`) → Next.js (`Link`, `useRouter`) — mechanical, touches every page, low-risk but not zero-effort
- Admin route protection: now genuinely implementable as **Next.js middleware** checking Firebase Auth session on every `/admin/*` request (this was previously listed as "expected until Next.js migration" in the discovery report — that migration is now happening, so implement it properly rather than leaving it client-side only)

---

## SECTION 4 — BUILD PRIORITY ORDER

1. **Fix draft leakage first** — this is a live security issue in the current build and should not wait for the full migration to be addressed conceptually, even if the actual fix lands as part of the new backend's query logic (filter `status == "published"` on all public reads).
2. Scaffold Next.js project structure; port over portable UI components and admin/inquiry client-rendered routes.
3. Build the new backend: Firebase Auth (real seeded user, `createSessionCookie`, replacing the plaintext comparison entirely — do not preserve that pattern even though it "worked"), Firestore (schema below), Firebase Storage (image upload, built from scratch — replace the current URL-paste inputs with real upload-with-preview per the admin panel visual reference), all as Vercel serverless functions / Next.js Route Handlers matching the preserved contract.
4. Convert the 6 public pages to Server Components + ISR.
5. Fix the remaining known bugs: edit form, author-link-by-slug, catalog filters/sort/pagination, related-books logic (language + category + series boost), inquiry failure fallback UI.
6. Remove inquiry DB persistence; add the two-email Resend flow (internal notification + auto-confirmation, copy branching on `inquirerType`).
7. Fresh deploy to Vercel — nothing carries over from Replit's hosting/autoscale config.

---

## SECTION 5 — FIRESTORE SCHEMA

**`books` collection:**
`title` (string, required), `slug` (string, required, auto-generated from title at creation, permanently fixed — never regenerates on edit), `coverImageUrl` (string, Firebase Storage URL), `authorId` (string, reference to `authors` doc, required), `authorName` (string, denormalized, kept in sync on author update), `synopsis` (string, optional), `contextBlurb` (string, optional), `language` (enum: `"Kiikaonde"` | `"Tonga/Chitonga"`, required), `category` (enum: `"Grammar & Language Reference"` | `"Folktales & Oral Tradition"` | `"Readers & Learning Series"` | `"Cultural & Historical Nonfiction"` | `"Children's Illustrated"`, required), `series` (string, optional), `seriesNumber` (number, optional), `format` (string, currently locked to `"Hardcover"`), `pageCount` (number, optional), `publicationDate` (string, optional), `isbn` (string, optional), `status` (enum: `"draft"` | `"published"`, required, default `"draft"`), `featured` (boolean, default `false`).

No `relatedBookIds` field — "You may also like" is computed at read time: same `language` + `category`, boosted by shared `series`, excluding the current book, limited to ~4 results.

**`authors` collection:**
`name` (string, required), `slug` (string, auto-generated, permanently fixed), `photoUrl` (string, optional), `bio` (string, optional).

No stored book-relationship field — "books by this author" is a live query on `books` where `authorId == author.id`.

**Inquiry payload (not persisted):** `inquirerType` (`"school"` | `"individual"`), `organizationName` (optional), `name` (required), `email` (required), `phone` (optional), `titlesOfInterest` (optional, pre-filled from Book Detail CTA), `quantityInterest` (optional), `message` (optional).

---

## SECTION 6 — CREDENTIALS: USE PLACEHOLDERS, DO NOT WAIT

**Do not block Phase 2 on real credentials.** Add all required environment variables now with clearly-marked placeholder values, and proceed with the full build (Firebase project scaffolding, Resend integration, deployment config) against those placeholders. The project owner will swap in real values before production use — this should be a drop-in replacement, not a rebuild.

**Required environment variables (add to `.env.example` and local `.env` with placeholders):**
```
# Firebase — client config
FIREBASE_API_KEY=REPLACE_ME
FIREBASE_AUTH_DOMAIN=REPLACE_ME
FIREBASE_PROJECT_ID=REPLACE_ME
FIREBASE_STORAGE_BUCKET=REPLACE_ME
FIREBASE_MESSAGING_SENDER_ID=REPLACE_ME
FIREBASE_APP_ID=REPLACE_ME

# Firebase — Admin SDK (server-side, for auth verification + session cookies)
FIREBASE_ADMIN_PROJECT_ID=REPLACE_ME
FIREBASE_ADMIN_CLIENT_EMAIL=REPLACE_ME
FIREBASE_ADMIN_PRIVATE_KEY=REPLACE_ME

# Resend
RESEND_API_KEY=REPLACE_ME
PRESS_INBOX_EMAIL=REPLACE_ME

# Admin seed account (used only for the one-time manual seed script, not runtime auth)
ADMIN_SEED_EMAIL=REPLACE_ME
ADMIN_SEED_PASSWORD=REPLACE_ME
```

Build and test everything possible against these placeholders — code structure, route handlers, middleware logic, the seed script itself. Where a real external call is unavoidable to verify behavior (e.g. an actual Firestore read, an actual Resend send), stub/mock it in a way that's clearly marked and easy to swap out, and note in your final report exactly which parts still need a real credential swap and a live test pass before this can be considered production-ready.

**Repo access:** proceed with whatever access currently exists (the Replit backup remote) unless a GitHub URL is provided later — don't block on this either.

---

## SECTION 7 — VERIFICATION CHECKLIST (Before Calling This Done)

- Draft-status books/authors are never retrievable via any public-facing route
- Slugs remain stable after a title/name edit
- Both inquiry states (`school` / `individual`) produce correct conditional field validation and correct branching email copy
- Admin routes redirect to `/admin/login` when unauthenticated (verified via middleware, not just client-side)
- No signup or password-reset route exists anywhere
- The 6 public pages return real content in server-rendered HTML (verify via "view source" or a crawler simulation, not just the browser's rendered DOM)
- Admin panel and Inquiry Form function identically to before, now running client-side within the Next.js app
- Image upload works end-to-end: admin selects a file, sees a preview, saves, and the image renders correctly on the public site
