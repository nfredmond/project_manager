"use server";

import { revalidatePath } from "next/cache";
import { getActiveTenant } from "@/lib/data-access";
import { getServerSupabaseClient } from "@/lib/supabase/server";

const FALLBACK_STATUS = "scheduled";

export async function createMeetingAction(formData: FormData) {
  const tenant = await getActiveTenant();
  if (!tenant) {
    throw new Error("Select a tenant before scheduling meetings.");
  }

  const payload = {
    project_id: formData.get("project_id") || null,
    title: String(formData.get("title") ?? ""),
    meeting_type: String(formData.get("meeting_type") ?? "internal"),
    meeting_date: formData.get("meeting_date"),
    location: formData.get("location"),
    status: String(formData.get("status") ?? FALLBACK_STATUS),
    recording_url: formData.get("recording_url"),
    notes: formData.get("notes"),
  };

  if (!payload.title) {
    throw new Error("Meeting title is required.");
  }

  const supabase = getServerSupabaseClient();
  const { error } = await supabase.from("meetings").insert({
    ...payload,
    tenant_id: tenant.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/meetings");
}

export async function updateMeetingStatusAction(formData: FormData) {
  const tenant = await getActiveTenant();
  if (!tenant) throw new Error("Select a tenant first.");
  const meetingId = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? FALLBACK_STATUS);
  if (!meetingId) throw new Error("Meeting id is required.");
  const supabase = getServerSupabaseClient();
  const { error } = await supabase
    .from("meetings")
    .update({ status })
    .eq("id", meetingId)
    .eq("tenant_id", tenant.id);
  if (error) throw new Error(error.message);
  revalidatePath("/meetings");
}

