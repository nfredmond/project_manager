"use server";

import { revalidatePath } from "next/cache";
import { getActiveTenant } from "@/lib/data-access";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { projectSchema, projectStatusSchema } from "@/lib/validations";

export async function createProjectAction(formData: FormData) {
  const tenant = await getActiveTenant();
  if (!tenant) throw new Error("Select a tenant first");
  const parsed = projectSchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
    status: formData.get("status"),
    budget: formData.get("budget"),
    spent: 0,
    description: formData.get("description"),
    client: formData.get("client"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((err) => err.message).join(", "));
  }
  const supabase = await getServerSupabaseClient();
  const { error } = await supabase.from("projects").insert({
    ...parsed.data,
    tenant_id: tenant.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/projects");
  revalidatePath("/dashboard");
}

export async function updateProjectStatusAction(projectId: string, status: string) {
  const tenant = await getActiveTenant();
  if (!tenant) throw new Error("Select a tenant first");
  const parsedStatus = projectStatusSchema.safeParse(status);
  if (!parsedStatus.success) throw new Error("Invalid status");

  const supabase = await getServerSupabaseClient();
  const { error } = await supabase
    .from("projects")
    .update({ status: parsedStatus.data })
    .eq("id", projectId)
    .eq("tenant_id", tenant.id);
  if (error) throw new Error(error.message);
  revalidatePath("/projects");
  revalidatePath("/dashboard");
}

