"use server";

import { revalidatePath } from "next/cache";
import { getActiveTenant } from "@/lib/data-access";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function upsertEnvironmentalFactorAction(formData: FormData) {
  const tenant = await getActiveTenant();
  if (!tenant) throw new Error("No tenant selected");
  const supabase = getServerSupabaseClient();
  const payload = {
    project_id: formData.get("project_id"),
    factor: formData.get("factor"),
    status: formData.get("status"),
    significance: formData.get("significance"),
    mitigation: formData.get("mitigation"),
    lead_agency: formData.get("lead_agency"),
    doc_url: formData.get("doc_url"),
    due_date: formData.get("due_date"),
  };
  const { error } = await supabase
    .from("environmental_factors")
    .upsert({ ...payload, tenant_id: tenant.id }, { onConflict: "project_id,factor" });
  if (error) throw new Error(error.message);
  revalidatePath("/environmental");
}

