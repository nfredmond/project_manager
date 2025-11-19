create or replace function public.user_in_tenant(target_tenant uuid)
returns boolean
language sql
security definer
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
security definer
stable
as $$
  select exists (
    select 1 from public.tenant_users tu
    where tu.tenant_id = target_tenant
      and tu.user_id = auth.uid()
      and tu.role = any(allowed_roles)
  );
$$;

create policy "View own membership" on public.tenant_users
  for select using (auth.uid() = user_id);

