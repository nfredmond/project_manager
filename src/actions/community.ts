"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function updateCommunityStatusAction(id: string, status: string) {
  const supabase = getServerSupabaseClient();
  const { error } = await supabase.from("community_inputs").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/community");
}

