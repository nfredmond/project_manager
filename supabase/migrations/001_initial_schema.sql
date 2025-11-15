create extension if not exists "pgcrypto";
create extension if not exists "citext";

create type public.tenant_role as enum ('admin','manager','staff','viewer');
create type public.project_status as enum ('draft','active','on_hold','completed','closed');
create type public.phase_type as enum ('PE','RW','RW_UTIL','CON','CE');
create type public.phase_status as enum ('planned','authorized','in_progress','submitted','closed');
create type public.grant_stage as enum ('prospecting','drafting','submitted','awarded','denied','reporting');
create type public.request_status as enum ('open','in_progress','fulfilled','closed');
create type public.meeting_type as enum ('board','council','community','internal','task_force');
create type public.document_category as enum ('contract','invoice','environmental','grant','meeting','caltrans','other');
create type public.community_status as enum ('new','review','approved','archived');
create type public.invoice_status as enum ('draft','submitted','accepted','returned','paid');

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  timezone text default 'America/Los_Angeles',
  branding jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);
create unique index tenants_slug_lower_idx on public.tenants (lower(slug));

create table public.profiles (
  id uuid primary key,
  full_name text,
  avatar_url text,
  title text,
  phone text,
  current_tenant uuid references public.tenants(id) on delete set null,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.tenant_users (
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null,
  role public.tenant_role not null default 'viewer',
  status text not null default 'active',
  invited_by uuid,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (tenant_id, user_id)
);
create index tenant_users_user_idx on public.tenant_users (user_id);

create table public.tenant_invitations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  email citext not null,
  role public.tenant_role not null default 'staff',
  token text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now())
);
create unique index tenant_invitations_token_key on public.tenant_invitations (token);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  code text,
  client text,
  status public.project_status not null default 'draft',
  description text,
  lead_manager uuid,
  start_date date,
  end_date date,
  ped date,
  budget numeric(14,2) not null default 0,
  spent numeric(14,2) not null default 0,
  funding jsonb not null default '{}'::jsonb,
  tags text[] default '{}',
  location jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index projects_tenant_idx on public.projects (tenant_id);
create index projects_status_idx on public.projects (tenant_id, status);

create table public.caltrans_phases (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  phase public.phase_type not null,
  status public.phase_status not null default 'planned',
  e76_number text,
  authorization_date date,
  ped_due_date date,
  nepa_status text,
  ps_e_certified boolean not null default false,
  federal_funds numeric(14,2) default 0,
  state_funds numeric(14,2) default 0,
  local_funds numeric(14,2) default 0,
  dbe_goal numeric(5,2),
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);
create index caltrans_phases_project_idx on public.caltrans_phases (project_id);

create table public.caltrans_invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  phase public.phase_type not null,
  invoice_number text not null,
  period_start date,
  period_end date,
  submitted_on date,
  status public.invoice_status not null default 'draft',
  total_amount numeric(14,2) not null default 0,
  federal_share numeric(14,2) default 0,
  state_share numeric(14,2) default 0,
  local_share numeric(14,2) default 0,
  document_url text,
  created_at timestamptz not null default timezone('utc', now())
);
create unique index caltrans_invoice_number_idx on public.caltrans_invoices (tenant_id, invoice_number);

create table public.grants (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  name text not null,
  grant_type text,
  stage public.grant_stage not null default 'prospecting',
  funding_source text,
  deadline date,
  award_date date,
  requested_amount numeric(14,2) default 0,
  match_amount numeric(14,2) default 0,
  summary text,
  ai_context jsonb not null default '{}'::jsonb,
  narrative jsonb not null default '[]'::jsonb,
  reminders jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index grants_tenant_idx on public.grants (tenant_id);

create table public.environmental_factors (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  factor text not null,
  status text not null default 'pending',
  significance text,
  mitigation text,
  lead_agency text,
  doc_url text,
  due_date date,
  created_at timestamptz not null default timezone('utc', now())
);
create unique index environmental_factor_unique on public.environmental_factors (project_id, factor);

create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  meeting_type public.meeting_type not null default 'internal',
  meeting_date timestamptz,
  location text,
  agenda jsonb not null default '[]'::jsonb,
  minutes jsonb not null default '[]'::jsonb,
  resolutions text,
  status text not null default 'scheduled',
  recording_url text,
  created_at timestamptz not null default timezone('utc', now())
);
create index meetings_tenant_idx on public.meetings (tenant_id);

create table public.records_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  requester text not null,
  contact text,
  topic text,
  received_on date not null default current_date,
  due_on date,
  status public.request_status not null default 'open',
  fulfillment jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);
create index records_requests_tenant_idx on public.records_requests (tenant_id);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  category public.document_category not null default 'other',
  storage_path text not null,
  version integer not null default 1,
  uploaded_by uuid,
  tags text[] default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);
create index documents_tenant_idx on public.documents (tenant_id);

create table public.sales_tax_programs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  measure text not null,
  revenue numeric(14,2) default 0,
  expenditures numeric(14,2) default 0,
  status text not null default 'draft',
  report jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);
create index sales_tax_programs_tenant_idx on public.sales_tax_programs (tenant_id);

create table public.community_inputs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  display_name text,
  email text,
  category text not null,
  description text,
  latitude double precision,
  longitude double precision,
  geojson jsonb,
  photo_url text,
  status public.community_status not null default 'new',
  source text not null default 'public',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);
create index community_inputs_tenant_idx on public.community_inputs (tenant_id);

create table public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  user_id uuid,
  kind text not null,
  prompt text not null,
  response text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger projects_touch_updated_at
before update on public.projects
for each row execute function public.touch_updated_at();

create trigger grants_touch_updated_at
before update on public.grants
for each row execute function public.touch_updated_at();

create or replace function public.user_in_tenant(target_tenant uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.tenant_users tu
    where tu.tenant_id = target_tenant
      and tu.user_id = auth.uid()
      and tu.status = 'active'
  );
$$;

create or replace function public.user_has_role(target_tenant uuid, allowed_roles tenant_role[])
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.tenant_users tu
    where tu.tenant_id = target_tenant
      and tu.user_id = auth.uid()
      and tu.role = any(allowed_roles)
  );
$$;

create or replace function public.create_tenant_with_owner(p_name text, p_slug text)
returns public.tenants
language plpgsql
security definer
set search_path = public
as $$
declare
  new_tenant public.tenants;
begin
  insert into public.tenants (name, slug)
    values (p_name, lower(p_slug))
    returning * into new_tenant;

  insert into public.tenant_users (tenant_id, user_id, role)
    values (new_tenant.id, auth.uid(), 'admin')
    on conflict do nothing;

  insert into public.profiles (id, full_name, current_tenant)
    values (auth.uid(), null, new_tenant.id)
    on conflict (id) do update set current_tenant = excluded.current_tenant;

  return new_tenant;
end;
$$;

grant execute on function public.create_tenant_with_owner(text, text) to authenticated;

grant usage on schema public to anon, authenticated, service_role;

grant select on public.tenants to anon;

create or replace function public.switch_tenant(target_tenant uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.user_in_tenant(target_tenant) then
    raise exception 'Not authorized for tenant %', target_tenant;
  end if;
  update public.profiles set current_tenant = target_tenant where id = auth.uid();
  return true;
end;
$$;

grant execute on function public.switch_tenant(uuid) to authenticated;

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.tenant_users enable row level security;
alter table public.tenant_invitations enable row level security;
alter table public.projects enable row level security;
alter table public.caltrans_phases enable row level security;
alter table public.caltrans_invoices enable row level security;
alter table public.grants enable row level security;
alter table public.environmental_factors enable row level security;
alter table public.meetings enable row level security;
alter table public.records_requests enable row level security;
alter table public.documents enable row level security;
alter table public.sales_tax_programs enable row level security;
alter table public.community_inputs enable row level security;
alter table public.ai_runs enable row level security;

create policy "Members read tenants" on public.tenants
  for select using (public.user_in_tenant(id));
create policy "Create tenant" on public.tenants
  for insert with check (auth.uid() is not null);
create policy "Admin update tenant" on public.tenants
  for update using (public.user_has_role(id, array['admin','manager']::public.tenant_role[]))
  with check (public.user_has_role(id, array['admin','manager']::public.tenant_role[]));
create policy "Admin delete tenant" on public.tenants
  for delete using (public.user_has_role(id, array['admin']::public.tenant_role[]));

create policy "Profiles are viewable by owner" on public.profiles
  for select using (auth.uid() = id or public.user_in_tenant(current_tenant));
create policy "Profiles updatable by owner" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);
create policy "Insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Members read tenant users" on public.tenant_users
  for select using (public.user_in_tenant(tenant_id));
create policy "Admins manage tenant users" on public.tenant_users
  for all using (public.user_has_role(tenant_id, array['admin','manager']::public.tenant_role[]))
  with check (public.user_has_role(tenant_id, array['admin','manager']::public.tenant_role[]));

create policy "Members read invitations" on public.tenant_invitations
  for select using (public.user_has_role(tenant_id, array['admin','manager']::public.tenant_role[]));
create policy "Admins manage invitations" on public.tenant_invitations
  for all using (public.user_has_role(tenant_id, array['admin']::public.tenant_role[]))
  with check (public.user_has_role(tenant_id, array['admin']::public.tenant_role[]));

create policy "Members read projects" on public.projects
  for select using (public.user_in_tenant(tenant_id));
create policy "Staff create projects" on public.projects
  for insert with check (public.user_has_role(tenant_id, array['admin','manager','staff']::public.tenant_role[]));
create policy "Staff update projects" on public.projects
  for update using (public.user_has_role(tenant_id, array['admin','manager','staff']::public.tenant_role[]))
  with check (public.user_has_role(tenant_id, array['admin','manager','staff']::public.tenant_role[]));
create policy "Admins delete projects" on public.projects
  for delete using (public.user_has_role(tenant_id, array['admin','manager']::public.tenant_role[]));

create policy "Members read caltrans phases" on public.caltrans_phases
  for select using (public.user_in_tenant(tenant_id));
create policy "Staff manage caltrans phases" on public.caltrans_phases
  for all using (public.user_has_role(tenant_id, array['admin','manager','staff']::public.tenant_role[]))
  with check (public.user_has_role(tenant_id, array['admin','manager','staff']::public.tenant_role[]));

create policy "Members read caltrans invoices" on public.caltrans_invoices
  for select using (public.user_in_tenant(tenant_id));
create policy "Admins manage caltrans invoices" on public.caltrans_invoices
  for all using (public.user_has_role(tenant_id, array['admin','manager']::public.tenant_role[]))
  with check (public.user_has_role(tenant_id, array['admin','manager']::public.tenant_role[]));

create policy "Members read grants" on public.grants
  for select using (public.user_in_tenant(tenant_id));
create policy "Staff manage grants" on public.grants
  for all using (public.user_has_role(tenant_id, array['admin','manager','staff']::public.tenant_role[]))
  with check (public.user_has_role(tenant_id, array['admin','manager','staff']::public.tenant_role[]));

create policy "Members read environmental factors" on public.environmental_factors
  for select using (public.user_in_tenant(tenant_id));
create policy "Staff manage environmental factors" on public.environmental_factors
  for all using (public.user_has_role(tenant_id, array['admin','manager','staff']::public.tenant_role[]))
  with check (public.user_has_role(tenant_id, array['admin','manager','staff']::public.tenant_role[]));

create policy "Members read meetings" on public.meetings
  for select using (public.user_in_tenant(tenant_id));
create policy "Staff manage meetings" on public.meetings
  for all using (public.user_has_role(tenant_id, array['admin','manager','staff']::public.tenant_role[]))
  with check (public.user_has_role(tenant_id, array['admin','manager','staff']::public.tenant_role[]));

create policy "Members read records requests" on public.records_requests
  for select using (public.user_in_tenant(tenant_id));
create policy "Staff manage records requests" on public.records_requests
  for all using (public.user_has_role(tenant_id, array['admin','manager','staff']::public.tenant_role[]))
  with check (public.user_has_role(tenant_id, array['admin','manager','staff']::public.tenant_role[]));

create policy "Members read documents" on public.documents
  for select using (public.user_in_tenant(tenant_id));
create policy "Staff manage documents" on public.documents
  for all using (public.user_has_role(tenant_id, array['admin','manager','staff']::public.tenant_role[]))
  with check (public.user_has_role(tenant_id, array['admin','manager','staff']::public.tenant_role[]));

create policy "Members read sales tax programs" on public.sales_tax_programs
  for select using (public.user_in_tenant(tenant_id));
create policy "Admins manage sales tax programs" on public.sales_tax_programs
  for all using (public.user_has_role(tenant_id, array['admin','manager']::public.tenant_role[]))
  with check (public.user_has_role(tenant_id, array['admin','manager']::public.tenant_role[]));

create policy "Members read community inputs" on public.community_inputs
  for select using (public.user_in_tenant(tenant_id));
create policy "Staff manage community inputs" on public.community_inputs
  for all using (public.user_has_role(tenant_id, array['admin','manager','staff']::public.tenant_role[]))
  with check (public.user_has_role(tenant_id, array['admin','manager','staff']::public.tenant_role[]));

create policy "Members read AI runs" on public.ai_runs
  for select using (public.user_in_tenant(tenant_id));
create policy "Staff insert AI runs" on public.ai_runs
  for insert with check (public.user_has_role(tenant_id, array['admin','manager','staff','viewer']::public.tenant_role[]));
create policy "Admins delete AI runs" on public.ai_runs
  for delete using (public.user_has_role(tenant_id, array['admin','manager']::public.tenant_role[]));
