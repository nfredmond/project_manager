"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function updateCommunityStatusAction(formData: FormData) {
  const supabase = await getServerSupabaseClient();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) throw new Error("Missing submission id or status");
  const { error } = await supabase.from("community_inputs").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/community");
}

