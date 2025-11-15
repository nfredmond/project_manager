"use server";

import { revalidatePath } from "next/cache";
import { invitationSchema, tenantRoleSchema } from "@/lib/validations";
import { getActiveTenant } from "@/lib/data-access";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import type { TenantRole } from "@/lib/types";

const MANAGER_ROLES: TenantRole[] = ["admin", "manager"];
const INVITE_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) {
    const url = process.env.VERCEL_URL.startsWith("http")
      ? process.env.VERCEL_URL
      : `https://${process.env.VERCEL_URL}`;
    return url;
  }
  return "http://localhost:3000";
}

export async function createInvitationAction(input: { email: string; role: string }) {
  const tenant = await getActiveTenant();
  if (!tenant) throw new Error("Select a tenant before inviting members");
  const supabase = getServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw new Error(authError.message);
  if (!user) throw new Error("Not authenticated");

  const { data: membership, error: membershipError } = await supabase
    .from("tenant_users")
    .select("role")
    .eq("tenant_id", tenant.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (membershipError) throw new Error(membershipError.message);
  if (!membership || !MANAGER_ROLES.includes(membership.role as TenantRole)) {
    throw new Error("Only tenant managers can invite new members");
  }

  const parsed = invitationSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((err) => err.message).join(", "));
  }

  const token = crypto.randomUUID();
  const expires_at = new Date(Date.now() + INVITE_EXPIRATION_MS).toISOString();

  const { error: insertError } = await supabase.from("tenant_invitations").insert({
    tenant_id: tenant.id,
    email: parsed.data.email,
    role: parsed.data.role,
    token,
    expires_at,
  });
  if (insertError) throw new Error(insertError.message);

  const inviteUrl = `${getBaseUrl()}/invite/${token}`;
  return { inviteUrl };
}

export async function acceptInvitationAction(token: string) {
  if (!token) throw new Error("Missing invite token");
  const supabase = getServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw new Error(authError.message);
  if (!user) throw new Error("Not authenticated");

  const { data: invite, error: inviteError } = await supabase
    .from("tenant_invitations")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (inviteError) throw new Error(inviteError.message);
  if (!invite) throw new Error("Invitation not found or already used");
  if (new Date(invite.expires_at).getTime() < Date.now()) {
    throw new Error("Invitation expired");
  }

  const roleParse = tenantRoleSchema.safeParse(invite.role);
  if (!roleParse.success) throw new Error("Invalid role on invitation");

  const { error: membershipError } = await supabase
    .from("tenant_users")
    .upsert(
      {
        tenant_id: invite.tenant_id,
        user_id: user.id,
        role: roleParse.data,
      },
      { onConflict: "tenant_id,user_id" },
    );
  if (membershipError) throw new Error(membershipError.message);

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ id: user.id, current_tenant: invite.tenant_id }, { onConflict: "id" });
  if (profileError) throw new Error(profileError.message);

  await supabase.from("tenant_invitations").delete().eq("id", invite.id);

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath("/settings");
}

export { MANAGER_ROLES };

