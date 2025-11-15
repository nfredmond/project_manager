"use server";

import { revalidatePath } from "next/cache";
import { phaseSchema } from "@/lib/validations";
import { getActiveTenant } from "@/lib/data-access";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function createCaltransPhaseAction(formData: FormData) {
  const tenant = await getActiveTenant();
  if (!tenant) throw new Error("Tenant not selected.");
  const parsed = phaseSchema.safeParse({
    project_id: formData.get("project_id"),
    phase: formData.get("phase"),
    status: formData.get("status"),
    e76_number: formData.get("e76_number"),
    authorization_date: formData.get("authorization_date"),
    ped_due_date: formData.get("ped_due_date"),
    federal_funds: formData.get("federal_funds"),
    state_funds: formData.get("state_funds"),
    local_funds: formData.get("local_funds"),
    dbe_goal: formData.get("dbe_goal"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((err) => err.message).join(", "));
  }
  const supabase = await getServerSupabaseClient();
  const { error } = await supabase.from("caltrans_phases").insert({
    ...parsed.data,
    tenant_id: tenant.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/caltrans");
  revalidatePath("/dashboard");
}

export async function createCaltransInvoiceAction(formData: FormData) {
  const tenant = await getActiveTenant();
  if (!tenant) throw new Error("Tenant not selected.");
  const supabase = await getServerSupabaseClient();
  const payload = {
    project_id: formData.get("project_id"),
    phase: formData.get("phase"),
    invoice_number: formData.get("invoice_number"),
    period_start: formData.get("period_start"),
    period_end: formData.get("period_end"),
    submitted_on: formData.get("submitted_on"),
    status: formData.get("status") ?? "draft",
    total_amount: Number(formData.get("total_amount") ?? 0),
    federal_share: Number(formData.get("federal_share") ?? 0),
    state_share: Number(formData.get("state_share") ?? 0),
    local_share: Number(formData.get("local_share") ?? 0),
    document_url: formData.get("document_url"),
  };
  const { error } = await supabase.from("caltrans_invoices").insert({ ...payload, tenant_id: tenant.id });
  if (error) throw new Error(error.message);
  revalidatePath("/caltrans");
}

