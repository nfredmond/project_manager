"use server";

import { revalidatePath } from "next/cache";
import { getActiveTenant } from "@/lib/data-access";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function createSalesTaxProgramAction(formData: FormData) {
  const tenant = await getActiveTenant();
  if (!tenant) throw new Error("Select a tenant before adding measures.");
  const payload = {
    measure: String(formData.get("measure") ?? ""),
    revenue: Number(formData.get("revenue") ?? 0),
    expenditures: Number(formData.get("expenditures") ?? 0),
    status: formData.get("status") ?? "draft",
    report: formData.get("report") ? { notes: formData.get("report") } : null,
  };
  if (!payload.measure) throw new Error("Measure label is required.");

  const supabase = await getServerSupabaseClient();
  const { error } = await supabase.from("sales_tax_programs").insert({
    ...payload,
    tenant_id: tenant.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/sales-tax");
}

export async function updateSalesTaxStatusAction(formData: FormData) {
  const tenant = await getActiveTenant();
  if (!tenant) throw new Error("Select a tenant first.");
  const programId = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "draft");
  if (!programId) throw new Error("Program id required");
  const supabase = await getServerSupabaseClient();
  const { error } = await supabase
    .from("sales_tax_programs")
    .update({ status })
    .eq("id", programId)
    .eq("tenant_id", tenant.id);
  if (error) throw new Error(error.message);
  revalidatePath("/sales-tax");
}

