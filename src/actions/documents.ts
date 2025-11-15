"use server";

import { revalidatePath } from "next/cache";
import { documentSchema } from "@/lib/validations";
import { getActiveTenant } from "@/lib/data-access";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function createDocumentAction(formData: FormData) {
  const tenant = await getActiveTenant();
  if (!tenant) throw new Error("No tenant selected");
  const parsed = documentSchema.safeParse({
    title: formData.get("title"),
    project_id: formData.get("project_id"),
    category: formData.get("category"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((err) => err.message).join(", "));
  }
  const storage_path = formData.get("storage_path");
  if (!storage_path) {
    throw new Error("Upload a file first.");
  }
  const supabase = await getServerSupabaseClient();
  const { error } = await supabase.from("documents").insert({
    ...parsed.data,
    storage_path,
    tenant_id: tenant.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/documents");
}

