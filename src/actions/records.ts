"use server";

import { revalidatePath } from "next/cache";
import { getActiveTenant } from "@/lib/data-access";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function createRecordRequestAction(formData: FormData) {
  const tenant = await getActiveTenant();
  if (!tenant) throw new Error("Select a tenant before logging requests.");

  const payload = {
    requester: String(formData.get("requester") ?? ""),
    contact: formData.get("contact"),
    topic: formData.get("topic"),
    received_on: formData.get("received_on") ?? new Date().toISOString().slice(0, 10),
    due_on: formData.get("due_on"),
    status: formData.get("status") ?? "open",
    project_id: formData.get("project_id"),
    notes: formData.get("notes"),
  };
  if (!payload.requester) throw new Error("Requester is required.");

  const supabase = getServerSupabaseClient();
  const { error } = await supabase.from("records_requests").insert({
    ...payload,
    tenant_id: tenant.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/records-requests");
}

export async function updateRecordStatusAction(formData: FormData) {
  const tenant = await getActiveTenant();
  if (!tenant) throw new Error("Select a tenant first.");
  const requestId = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "open");
  if (!requestId) throw new Error("Request id missing.");
  const supabase = getServerSupabaseClient();
  const { error } = await supabase
    .from("records_requests")
    .update({ status })
    .eq("id", requestId)
    .eq("tenant_id", tenant.id);
  if (error) throw new Error(error.message);
  revalidatePath("/records-requests");
}

