# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Push Prisma schema to DB (no migration)
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
npx prisma migrate dev --name <name>  # Create a migration
```

## Architecture Overview

**GoFor Properties** is a multi-role property management platform (Next.js 16 App Router). Five user roles — OWNER, TENANT, TRADER, AGENT, ADMIN — each have their own dashboard under `src/app/(dashboard)/<role>/`.

### Route Groups

| Group | Path | Purpose |
|---|---|---|
| `(auth)` | `/login`, `/register` | Unauthenticated pages |
| `(dashboard)` | `/admin`, `/agent`, `/owner`, `/tenant`, `/trader` | Role-gated dashboards |
| `(public)` | `/properties`, `/services/*` | Public-facing pages |

### Auth & Middleware

- **NextAuth v5** with JWT strategy. Config lives in `src/lib/auth/config.js`; exports (`auth`, `signIn`, etc.) re-exported from `src/lib/auth/index.js`.
- **Middleware** (`src/middleware.js`) uses a separate edge-compatible config (`src/lib/auth/auth.edge.js`) — no Prisma in the middleware. It guards routes and redirects by role.
- Public prefixes (no auth required): `/login`, `/register`, `/api/auth`, `/properties`, `/api/public`, `/services`.

### API Routes

All API routes follow this pattern:
1. Authenticate via `await auth()` from `src/lib/auth`
2. Validate input with a Zod schema from `src/lib/validators/index.js`
3. Query the DB via `prisma` singleton from `src/lib/db/index.js`
4. Return using helpers from `src/lib/api/response.js` (`success`, `error`, `unauthorized`, `forbidden`, `notFound`, `paginated`, `handleError`)

### Key Libraries

- **`src/lib/api/response.js`** — All API responses must use these helpers for consistency.
- **`src/lib/events/index.js`** — `logEvent()` writes to the `SystemEvent` audit log table. Call this for any significant state changes.
- **`src/lib/notifications/index.js`** — `createNotification()` and `notifyAdmins()` for in-app notifications.
- **`src/lib/s3/index.js`** — Presigned URL generation/deletion for `PropertyDocument` file uploads. Never expose AWS credentials to the client.
- **`src/lib/validators/index.js`** — All Zod schemas. Add new schemas here; use `.partial()` for update schemas.

### Database

PostgreSQL + Prisma 5. Schema at `prisma/schema.prisma`.

Key domain models:
- **Property** → has `PropertyDocument` (S3-backed) and `PropertyListing` (third-party platforms)
- **ServiceRequest** → `JobAssignment` (trader) → `Payment` (Stripe)
- **AgentProfile** → `Inquiry` + `InquiryFollowUp` + `AgentDailyLog` + `AgentLocationLog` + `AgentSubscription`
- **Notification** + **SystemEvent** — cross-cutting audit/notification tables

After changing `schema.prisma`, run `npm run db:push` (dev) or `npx prisma migrate dev` (tracked migration).

### Client State

Zustand stores in `src/stores/`:
- `useUIStore` — modals, sidebar open/close
- `usePropertyStore`, `useServiceRequestStore`, `useAgentStore` — domain state

Custom hooks in `src/hooks/`: `useFetch` (generic data fetching with loading/error) and `useDebounce`.

### Components

Organized by role/domain under `src/components/{admin,agent,property,service-request,shared,ui}`. Radix UI primitives live in `src/components/ui/`. Use `clsx` + `tailwind-merge` (via `cn()` utility) for conditional class names.

## Required Environment Variables

```
AUTH_SECRET
DATABASE_URL
GOOGLE_CLIENT_ID          # optional OAuth
GOOGLE_CLIENT_SECRET      # optional OAuth
AWS_REGION
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_S3_BUCKET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLIC_KEY
```
