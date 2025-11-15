"use server";

import { revalidatePath } from "next/cache";
import { getActiveTenant } from "@/lib/data-access";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { grantSchema } from "@/lib/validations";
import { dispatchEventNotification } from "@/lib/notifications";

export async function createGrantAction(formData: FormData) {
  const tenant = await getActiveTenant();
  if (!tenant) throw new Error("No tenant selected");
  const parsed = grantSchema.safeParse({
    name: formData.get("name"),
    project_id: formData.get("project_id"),
    grant_type: formData.get("grant_type"),
    stage: formData.get("stage") ?? "prospecting",
    funding_source: formData.get("funding_source"),
    deadline: formData.get("deadline"),
    requested_amount: formData.get("requested_amount"),
    match_amount: formData.get("match_amount"),
    summary: formData.get("summary"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error errors) trimmed }]} }