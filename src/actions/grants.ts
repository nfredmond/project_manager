"use server";

import { revalidatePath } from "next/cache";
import { getActiveTenant } from "@/lib/data-access";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { grantSchema, grantStageSchema } from "@/lib/validations";
import { dispatchEventNotification } from "@/lib/notifications";

export async function createGrantAction(formData: FormData) {
  const tenant = await getActiveTenant();
  if (!tenant) throw new Error("No tenant selected");
  const parsed = grantSchema.safeParse({
    name: formData.get("name"),
    project_id: formData.get("project_id"),
    grant_type: formData.get("grant_type"),
    stage: formData.get("stage"),
    funding_source: formData.get("funding_source"),
    deadline: formData.get("deadline"),
    requested_amount: formData.get("requested_amount"),
    match_amount: formData.get("match_amount"),
    summary: formData.get("summary"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((err) => err.message).join(", "));
  }
  const supabase = getServerSupabaseClient();
  const { error } = await supabase.from("grants").insert({
    ...parsed.data,
    tenant_id: tenant.id,
  });
  if (error) throw new Error(error.message);

  try {
    await dispatchEventNotification({
      title: "New grant created",
      message: `${parsed.data.name} added for ${tenant.name}`,
    });
  } catch (notificationError) {
    console.error("Notification failed", notificationError);
  }

  revalidatePath("/grants");
  revalidatePath("/dashboard");
}

export async function updateGrantStageAction(grantId: string, stage: string) {
  const tenant = await getActiveTenant();
  if (!tenant) throw new Error("No tenant selected");
  const parsedStage = grantStageSchema.safeParse(stage);
  if (!parsedStage.success) {
    throw new Error("Invalid stage");
  }
  const supabase = getServerSupabaseClient();
  const { error } = await supabase
    .from("grants")
    .update({ stage: parsedStage.data })
    .eq("id", grantId)
    .eq("tenant_id", tenant.id);
  if (error) throw new Error(error.message);
  revalidatePath("/grants");
  revalidatePath("/dashboard");
}