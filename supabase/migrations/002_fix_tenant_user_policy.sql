drop policy if exists "Members read tenant users" on public.tenant_users;
create policy "Members read tenant users" on public.tenant_users
  for select using (auth.uid() = user_id);
