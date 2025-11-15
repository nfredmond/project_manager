# Nat Ford Planning Multi-Tenant SaaS Platform: Complete Development Plan

## Executive Summary

This comprehensive plan delivers an aggressive 1-week MVP for a multi-tenant planning management SaaS platform built on Supabase/Vercel with Mapbox integration and AI features. The platform serves planning consultancies and local agencies with Caltrans LAPM compliance, grant management, CEQA workflows, and public engagement tools.

## Technology Stack

**Core Infrastructure:**
- Frontend: Next.js 15 (App Router) + TypeScript
- Database: Supabase (PostgreSQL + PostGIS)
- Deployment: Vercel
- Authentication: Supabase Auth (cookie-based sessions)

**Key Libraries:**
- State Management: TanStack Query v5 + Zustand v5
- UI: Shadcn/ui + Radix UI + Tailwind CSS
- Forms: React Hook Form v7 + Zod v3
- Mapping: react-map-gl v7 with Mapbox
- AI: Vercel AI SDK v5 (OpenAI GPT-4o)
- Testing: Vitest v4 + Playwright v1.4x

## Database Schema Highlights

**Multi-Tenant Core:**
- Tenants table with settings/branding JSONB
- Tenant_users junction with role-based access
- RLS policies on ALL tables for data isolation
- Helper function: auth.tenant_id() from JWT

**Key Modules (20+ tables):**
1. Projects & Contracts
2. Caltrans LAPM Tracking (E-76, invoices, phases)
3. CEQA/NEPA Compliance (18 environmental factors)
4. Grant Management (lifecycle, documents, reports)
5. Sales Tax Programs (Measure M/R, local return)
6. Meeting Management (agendas, minutes, resolutions)
7. Public Records Requests
8. Document Library (version control)
9. Community Input (map-based, public access)

## Schedule

**Foundation**
- Project setup with Supabase template
- Database schema deployment
- Authentication implementation
- RLS policy configuration

**Multi-Tenant Core**
- Tenant onboarding workflow
- Dashboard layout with navigation
- Project CRUD operations
- Basic settings/branding

**Caltrans LAPM**
- E-76 authorization tracking
- LAPM phase workflows (PE/RW/CON)
- Invoice submission interface
- Contract & client management

**Environmental & Grants**
- CEQA/NEPA tracking module
- 18-factor environmental checklist
- Grant lifecycle management
- Reporting templates

**Mapbox Integration**
- Community input map (CARTO Voyager)
- Pin placement with categories
- Photo uploads to Supabase Storage
- Public submission portal

**AI & Meetings**
- AI chatbot (Vercel AI SDK)
- Grant narrative writing assistant
- Meeting management (Brown Act compliance)
- Document library with search

**Completion**
- Sales tax measure tracking
- Analytics dashboard
- Testing critical flows
- Production deployment to Vercel

## Critical Implementation Patterns

**1. Tenant Isolation:**
```typescript
// RLS automatically enforces tenant_id filtering
const { data } = await supabase
  .from('projects')
  .select('*')
  .eq('tenant_id', tenantId); // Always add explicit filter
```

**2. Server Components (Default):**
```typescript
// app/(dashboard)/projects/page.tsx
export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('*');
  return <ProjectsList projects={projects} />;
}
```

**3. AI Integration:**
```typescript
// app/api/generate/grant-narrative/route.ts
const { text } = await generateText({
  model: openai('gpt-4o'),
  prompt: `Write ${section} for ${grantType} application...`
});
```

## Key Features

**Public Engagement:**
- Configurable map categories
- Photo upload capability
- Anonymous submissions
- Admin moderation interface
- Data export to GIS formats

**Caltrans LAPM Management:**
- E-76 authorization tracking with all phases
- Federal/state/local fund allocation
- Invoice generation (LAPM 5-A format)
- Project End Date monitoring
- NEPA approval tracking
- Right of Way certification status
- DBE goal tracking

**Grant Management:**
- Opportunity tracking with alerts
- AI-powered narrative generation
- Application workflow management
- Progress/financial/performance reporting
- BCA calculator integration
- Match tracking

**Environmental Compliance:**
- CEQA/NEPA document templates
- 18 Appendix G environmental factors
- Public comment period tracking
- Mitigation measure database
- NOD/NOE generation



## Caltrans LAPM Research Findings

**Project Lifecycle Phases:**
1. **Preliminary Engineering (PE):** Location studies, NEPA, design, PS&E
2. **Right of Way (RW):** Acquisition, appraisals, relocation assistance
3. **Utility Relocation (RW-UTIL):** Coordination per 23 CFR 645.119
4. **Construction (CON):** Physical construction
5. **Construction Engineering (CE):** Supervision, inspection, testing

**Critical Requirements:**
- Authorization required BEFORE work begins
- Federal funds require E-76 approval (3 week processing)
- NEPA approval before RW activities
- PS&E certification required for construction
- PE phase cannot exceed 10 years without extension
- Project End Date = completion date + 12 months
- Invoicing within 120 days of PED

**Key Forms/Documents:**
- LAPM 3-A: Project Authorization Request
- E-76: Federal Authorization to Proceed
- Finance Letter (LP2000): Funding summary
- Exhibit 12-D: PS&E Checklist
- LAPM 5-A: Invoice format

## Deployment Configuration

**Environment Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.<mapbox-token>
NEXT_PUBLIC_CENSUS_API_KEY=<census-api-key>
OPENAI_API_KEY=<openai-key>
```

**Vercel Deployment:**
1. Connect GitHub repository: https://github.com/nfredmond/project_manager
2. Auto-deploy on push to main
3. Configure environment variables
4. Vercel project id: prj_yAeRWry89Wqg6p8SiSCtewem9Xc9


## File Structure

```
app/
├── (auth)/login, signup, callback
├── (dashboard)/
│   ├── projects/
│   ├── caltrans/
│   ├── environmental/
│   ├── grants/
│   ├── sales-tax/
│   ├── meetings/
│   ├── records-requests/
│   ├── documents/
│   └── reports/
├── (public)/community/[slug]
└── api/chat, generate, analyze

components/
├── ui/ (Shadcn)
└── features/ (domain components)

lib/
├── supabase/ (clients)
├── hooks/ (use-tenant, use-projects)
└── utils/
```

## Testing Strategy

**E2E Tests (Playwright):**
- Authentication flow
- Project creation → Caltrans tracking → invoice
- Grant application with AI generation
- Public community input submission

**Unit Tests (Vitest):**
- Utility functions
- Validation schemas
- RLS policy logic

## Performance Optimizations

1. **Database:** Composite indexes on (tenant_id, common_filter)
2. **Queries:** Always include explicit tenant_id filter
3. **Caching:** TanStack Query with 1-min staleTime
4. **Images:** Next.js Image component (automatic optimization)
5. **Maps:** Lazy load with dynamic imports

## Security Measures

1. ✅ RLS enabled on ALL tables
2. ✅ Tenant_id derived from JWT (never trusted from client)
3. ✅ Service role key only in API routes
4. ✅ Storage bucket RLS policies
5. ✅ Input validation with Zod schemas
6. ✅ HTTP-only cookies for sessions

## Competitive Advantages

1. **Only platform with native Caltrans LAPM tracking**
2. **AI grant writing assistant** (GPT-4o powered)
3. **Multi-tenant from Day 1** (unlimited scalability)
4. **Configurable public engagement maps**
5. **Sales tax measure compliance** (CA-specific)
6. **All-in-one platform** (replaces 5-10 disconnected tools)

## Other features

- Email notifications (deadlines, assignments)
- Mobile PWA with offline support
- QuickBooks Online integration
- Google Calendar sync
- Advanced analytics dashboard
- PDF export for reports
- Slack notifications

## Success Metrics

- 3 paying tenants within 30 days
- 80% weekly active users
- 10+ hours saved per week per agency
- Increased grant win rates
- 5x more community feedback

## Conclusion

This plan delivers a production-ready MVP that solves critical pain points for planning consultancies and local agencies. The multi-tenant architecture ensures unlimited scalability, while focused features address core workflows: Caltrans compliance, grant management, environmental tracking, and community engagement. Built on modern, proven technologies (Next.js 15, Supabase, Vercel) with enterprise-grade security through RLS.

**Ready for execution with complete architecture, schema, and implementation patterns defined.**