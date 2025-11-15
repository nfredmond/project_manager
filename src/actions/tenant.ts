"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabaseClient } from "@/lib/supabase/server";

const DASHBOARD_PATHS = [
  "/dashboard",
  "/projects",
  "/caltrans",
  "/grants",
  "/environmental",
  "/documents",
  "/community",
];

export async function switchTenantAction(tenantId: string) {
  if (!tenantId) throw new Error("Tenant selection required");
  const supabase = getServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error(authError?.message ?? "Not authenticated");
  }

  const { data: membership, error: membershipError } = await supabase
    .from("tenant_users")
    .select("tenant_id")
    .eq("tenant_id", tenantId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (membershipError) throw new Error(membershipError.message);
  if (!membership) throw new Error("You do not have access to that tenant");

  const { error: updateError } = await supabase.from("profiles").update({ current_tenant: tenantId }).eq("id", user.id);
  if (updateError) throw new Error(updateError.message);

  DASHBOARD_PATHS.forEach((path) => revalidatePath(path));
}

