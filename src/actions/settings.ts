"use server";

import { revalidatePath } from "next/cache";
import { getActiveTenant, getProfile } from "@/lib/data-access";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function updateTenantSettingsAction(formData: FormData) {
  const tenant = await getActiveTenant();
  if (!tenant) throw new Error("Select a tenant first.");
  const supabase = getServerSupabaseClient();

  const updates = {
    name: formData.get("name") ?? tenant.name,
    timezone: formData.get("timezone") ?? tenant.timezone,
    branding: {
      accent: formData.get("accent") ?? "#2563eb",
      logo_url: formData.get("logo_url") ?? null,
    },
    settings: {
      enable_public_portal: formData.get("enable_public_portal") === "on",
      default_dashboard: formData.get("default_dashboard") ?? "overview",
    },
  };

  const { error } = await supabase.from("tenants").update(updates).eq("id", tenant.id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
}

export async function updateProfileAction(formData: FormData) {
  const profile = await getProfile();
  if (!profile) throw new Error("Sign in to update profile.");
  const supabase = getServerSupabaseClient();
  const payload = {
    full_name: formData.get("full_name") ?? profile.full_name,
    title: formData.get("title") ?? profile.title,
    phone: formData.get("phone") ?? profile.phone,
  };
  const { error } = await supabase.from("profiles").update(payload).eq("id", profile.id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/settings");
}

