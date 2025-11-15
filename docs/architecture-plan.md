## Project Manager SaaS – Architecture Plan

### Objectives
- Ship a multi-tenant planning management MVP in seven days with Supabase + Next.js.
- Cover Caltrans LAPM tracking, grant + environmental workflows, and community engagement.
- Provide AI-assisted authoring, Mapbox visualization, and strong RLS isolation.

### Frontend Stack
- **Next.js 15 App Router** with TypeScript, server components by default.
- **Tailwind CSS + Shadcn/ui** for consistent UI primitives (Button, Card, Dialog, Table, etc.).
- **TanStack Query v5** for async caching and optimistic updates; **Zustand** for lightweight UI/tenant context.
- **React Hook Form + Zod** for all forms with schema validation.
- **react-map-gl v7** for interactive Mapbox-powered maps.
- **Vercel AI SDK** for grant-writing assistant + chatbot surfaces.
- **Testing**: Vitest for units, Playwright for smoke E2E.

### Directory Layout
```
src/
├── app/
│   ├── (auth)/login, signup, callback
│   ├── (dashboard)/
│   │   ├── projects/
│   │   ├── caltrans/
│   │   ├── environmental/
│   │   ├── grants/
│   │   ├── sales-tax/
│   │   ├── meetings/
│   │   ├── records-requests/
│   │   ├── documents/
│   │   └── reports/
│   ├── (public)/community/[slug]
│   └── api/chat, generate, analyze, uploads
├── components/
│   ├── ui/ (Shadcn exported primitives)
│   └── features/ (domain-specific widgets)
├── lib/
│   ├── supabase/ (browser + server clients)
│   ├── auth/ (session helpers, middleware)
│   ├── hooks/ (use-tenant, use-grants, etc.)
│   └── utils/ (formatters, map helpers, ai prompts)
└── tests/ (vitest + playwright specs)
```

### Supabase Data Model
- `tenants`: metadata + branding JSON, slug, feature flags.
- `profiles`: extends `auth.users` with name/role defaults.
- `tenant_users`: join table with role enum (`admin`, `manager`, `staff`, `viewer`).
- `projects`: core entity with funding + schedule fields.
- `caltrans_phases`: PE/RW/CON/CE progress, E-76, NEPA, DBE metrics.
- `caltrans_invoices`: LAPM 5-A style invoices referencing projects & phases.
- `environmental_checklists`: 18-factor CEQA/NEPA statuses + mitigation notes.
- `grants`: lifecycle tracking, deadlines, AI narrative drafts.
- `meetings`: agendas, Brown Act compliance, attachments.
- `documents`: storage references with versioning + tags.
- `records_requests`: PRA tracking, deadlines, fulfillment status.
- `community_inputs`: public map submissions with GeoJSON + photo URLs.
- `notifications`: email/slack queue for alerts.

**Helper Functions & Policies**
- `auth.tenant_id()` derives tenant from JWT claims.
- RLS across every table `using (tenant_id = auth.tenant_id())`.
- Insert policies for service role + onboarding workflow.
- Postgres `check` constraints for enums & statuses.

### Key Flows
1. **Authentication & Onboarding**
   - Email/password via Supabase Auth.
   - Signup wizard creates tenant + admin membership.
   - Tenant switcher UI surfaces multi-tenant access.
2. **Dashboard**
   - Server component grabs summary metrics (projects, E-76 deadlines, open grants, community submissions).
   - Client charts for burn rates + timeline.
3. **Projects & Caltrans LAPM**
   - CRUD for projects, timeline phases, invoice generation stub (download PDF later).
   - Alerts for upcoming PED/invoice deadlines.
4. **Environmental & Grants**
   - Checklist UI for CEQA factors.
   - Grant workspace with AI narrative assistant + template outputs.
5. **Meetings & Records Requests**
   - Agenda builder, minutes, resolution log.
   - PRA tracker with SLA statuses.
6. **Document Library**
   - Uploads to Supabase Storage with version history.
7. **Community Engagement**
   - Public `/community/[tenantSlug]` page with Mapbox map, category filters, submission form, photo upload.
   - Admin moderation queue in dashboard.
8. **AI / Analytics**
   - Vercel AI route for grant narrative + meeting summaries.
   - Reports page with KPIs + PDF export hook.

### Integrations
- **Mapbox** token via `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`.
- **OpenAI / Vercel AI SDK** via `OPENAI_API_KEY`.
- **Supabase Storage** buckets: `documents`, `community-photos`.
- **Email/Slack** placeholders via webhooks (future).

### Testing & Deployment
- Vitest unit tests for utils, Zod schemas, RLS helper functions using Supabase in-memory.
- Playwright smoke: login, create project, submit community input, run AI narrative.
- GitHub → Vercel auto deploy (project id `prj_yAeRWry89Wqg6p8SiSCtewem9Xc9`).
- Supabase migrations applied via MCP `list_migrations/apply_migration`.

### Next Steps
1. Implement Supabase schema + RLS.
2. Build auth/onboarding + dashboard shell.
3. Implement modules incrementally (projects → caltrans → grants → environmental → community).
4. Wire AI + Mapbox integrations.
5. Add automated tests + linting CI.


