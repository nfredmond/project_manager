## Project Manager – Caltrans + Grants Platform

Multi-tenant planning OS built with Next.js 15, Supabase, and Vercel. Features LAPM tracking, CEQA/NEPA checklists, grant AI narratives, PRA requests, document storage, and a public community portal.

### Tech stack
- Next.js App Router (TypeScript, React Server Components)
- Tailwind CSS + shadcn/ui + Radix
- Supabase Postgres/Auth/Storage
- TanStack Query, Zustand, React Hook Form
- Vercel AI SDK with OpenAI GPT-4o-mini
- Mapbox GL, Recharts, Vitest, Playwright-ready

### Environment
Copy `.env.example` → `.env.local` and fill:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=...
NEXT_PUBLIC_CENSUS_API_KEY=...
OPENAI_API_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
RESEND_API_KEY=...
COMMUNITY_ALERT_EMAIL=engagement@example.com
```

### Feature highlights
- **Caltrans LAPM**: phase + invoice tracker with PDF exports (`/caltrans`, `/api/caltrans/invoices/:id/pdf`)
- **Grants**: AI narrative composer (Vercel AI SDK + GPT-4o mini), stage workflows, pipeline analytics
- **Environmental**: Appendix G checklist with mitigation + lead agency tracking
- **Documents**: Supabase Storage uploads with shadcn dialogs, versioning, and sharing
- **Meetings & PRA**: governance hub for agendas, recordings, and PRA fulfillment
- **Sales tax**: Measure revenue dashboards and compliance notes
- **Community portal**: Public page at `/community/[slug]` + moderation workspace, Slack/Resend notifications

### Supabase
- Schema + RLS via `supabase/migrations/001_initial_schema.sql`. Apply with Supabase CLI or MCP `apply_migration`.
- Seed the demo data/tenants with `npm run seed` (uses `scripts/seed.mjs`). Demo creds: `demo@projectmanager.local / ProjectDemo!23`.

### Development
```bash
npm install
npm run dev
# lint / typecheck / unit tests
npm run lint
npm run typecheck
npm run test
# smoke e2e (requires app running + seeded data)
npx playwright test
```

Visit `http://localhost:3000`. Signup creates tenant and admin membership. Dashboard available at `/dashboard`.

### Testing & QA
- `npm run lint` → ESLint + Next rules
- `npm run typecheck` → strict TS
- `npm run test` → Vitest unit tests (`tests/utils.test.ts`, `tests/data-access.test.ts`)
- `npx playwright test` → smoke flow (landing + login)

### Deployment
- Configured for Vercel (project id from `VERCEL DATA.md` + `.vercel/project.json`).
- Set environment variables in Vercel dashboard or via `vercel env`. You can also rely on `vercel.json` checked into the repo.
- `npm run build` verifies Next.js production output.
- Deploy with `vercel deploy --prod` once logged in.

### Extras
- PDF exports: `/api/caltrans/invoices/:id/pdf` and `/api/reports/summary/pdf`
- Notifications: Slack + Resend via `SLACK_WEBHOOK_URL`, `RESEND_API_KEY`, `COMMUNITY_ALERT_EMAIL`
- Public engagement: `/community/[slug]` uses `/api/community/submit` + moderation dashboard
- Invite flows: settings page generates invite links (`/invite/[token]`)
- Password reset: `/reset` and `/update-password`
- Role-based guards hide editing UI for viewer-only members
