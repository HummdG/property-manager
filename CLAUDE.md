# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Next.js dev server (http://localhost:3000)
- `npm run build` — production build (also re-runs `prisma generate` via `postinstall`)
- `npm run start` — run production build
- `npm run lint` — ESLint (flat config, `eslint-config-next/core-web-vitals`)
- `npm run db:push` — push `prisma/schema.prisma` to the database without a migration
- `npm run db:seed` — run `prisma/seed.js` to seed dev data
- `npm run db:studio` — open Prisma Studio

The repo is plain JavaScript (no TypeScript). Path alias `@/*` → `./src/*` is set in `jsconfig.json`.

## Architecture

### Stack
- **Next.js 16 App Router** (React 19), Tailwind v4 via `@tailwindcss/postcss`, Radix UI primitives in `src/components/ui/`
- **Prisma + PostgreSQL** (`DATABASE_URL`)
- **Auth.js v5 (next-auth beta)** with `@auth/prisma-adapter`, JWT session strategy, Credentials + optional Google provider
- **Zustand** for client state (`src/stores/`)
- **Zod** for input validation (`src/lib/validators/`)
- **AWS S3** for property documents via presigned URLs (`src/lib/s3/`)
- **Stripe** for payments and agent subscriptions

### Route organization (App Router groups)
`src/app/` uses three route groups so each has its own root layout:
- `(public)` — marketing site at `/`, public properties listing, services pages
- `(auth)` — `/login`, `/register`
- `(dashboard)` — role-scoped dashboards: `/admin`, `/owner`, `/tenant`, `/trader`, `/agent`

API routes live under `src/app/api/`, organized by role/feature: `admin/`, `agent/`, `properties/`, `service-requests/`, `tenant/`, `trader/`, `traders/`, `categories/`, `public/`, `auth/`.

### Auth and role-based access
There are **two** auth configs because middleware runs on the Edge runtime and cannot import Prisma:
- `src/lib/auth/config.js` — full config with PrismaAdapter, used by server (`auth()`, route handlers, `api/auth/[...nextauth]`)
- `src/lib/auth/auth.edge.js` — minimal JWT-only config exported as `authMiddleware`, used by `src/middleware.js`

`src/middleware.js` is the access-control choke point: it lists public prefixes, lets `/api/*` through (each route enforces its own auth), and otherwise enforces `roleRoutes` — e.g. `ADMIN` can access all role areas, `OWNER` only `/owner`, etc. After login users are redirected via `getDashboardForRole`. When adding a new role-scoped route, update both `publicPrefixes`/`roleRoutes` here and the corresponding entry in `src/lib/auth/index.js` (`ROLES`, `getDashboardPath`).

Inside API route handlers the pattern is: `const session = await auth()` from `@/lib/auth`, then branch on `session.user.role` and `session.user.id` to filter Prisma queries (see `src/app/api/service-requests/route.js` for the canonical example of role-scoped filtering on `ServiceRequest`).

### Data model (Prisma)
`prisma/schema.prisma` defines the full domain. Key entities and how they relate:
- `User` has a `UserRole` (OWNER/TENANT/TRADER/ADMIN/AGENT) and optionally one of `TraderProfile` / `TenantProfile` / `AgentProfile` (1:1).
- `Property` (owned by an OWNER) → `ServiceRequest` (created by owner or tenant) → `JobAssignment` (links a request to a TRADER) → `Payment` (Stripe).
- `AgentProfile` → `Inquiry` → `InquiryFollowUp`; agents also have `AgentDailyLog`, `AgentLocationLog`, and `AgentSubscription` against a `SubscriptionPlan`. `PropertyListing` connects a property to a `ThirdPartyPlatform`.
- `PropertyDocument` stores S3 `fileKey` for DEED/NOC docs (unique per `[propertyId, type]`).
- `SystemEvent` is an append-only audit log; `Notification` is per-user.

`src/lib/db/index.js` exports a Prisma singleton (`db`) using a `globalThis` cache so dev hot-reload doesn't open many connections — always import from `@/lib/db`, never `new PrismaClient()`.

### Cross-cutting helpers
- `src/lib/api/response.js` — `success`, `error`, `notFound`, `unauthorized`, `forbidden`, `paginated`, `handleError` (maps Prisma `P2002`/`P2025` and `ZodError` to proper HTTP responses). Newer routes should prefer these helpers; older routes return `NextResponse.json` directly.
- `src/lib/events/logEvent({ type, action, entity, entityId, userId, metadata })` — write to `SystemEvent`. Swallows errors so logging never breaks the request.
- `src/lib/notifications/createNotification(...)` and `notifyAdmins(...)` — fire-and-forget notification creation.
- `src/lib/s3/` — `generatePresignedUploadUrl`, `generatePresignedDownloadUrl`, `deleteObject`, `getPublicUrl`, `generateDocumentKey(propertyId, docType, originalName)`.
- `src/lib/validators/` — central Zod schemas (`loginSchema`, `registerSchema`, `createPropertySchema`, `createServiceRequestSchema`, `assignJobSchema`, `createPaymentSchema`, etc.).

### Frontend layer
- `src/stores/` — feature-scoped Zustand stores: `agent-store`, `property-store`, `service-request-store`, `ui-store`. Plain `create()` (no persist middleware).
- `src/components/ui/` — Radix-based primitives (`button`, `card`, `dialog`, `select`, `dropdown-menu`, etc.); style with `cn()` from `src/lib/utils`. Other component dirs (`admin/`, `agent/`, `property/`, `dashboard/`, `service-request/`, `shared/`) are feature-scoped.
- `src/hooks/use-fetch.js`, `use-debounce.js` for common client patterns.

### Environment variables
Required at runtime: `DATABASE_URL`, `AUTH_SECRET`. Optional: `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (Google provider is only registered when both are set), `AWS_REGION`/`AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`/`AWS_S3_BUCKET`, Stripe keys.
