import { NextResponse } from "next/server";
import { generateText } from "ai";
import type { LanguageModelV1 } from "ai";
import { openai } from "@ai-sdk/openai";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.json();
  const { projectId, grantType, section, context } = body;
  if (!projectId || !section) {
    return NextResponse.json({ error: "projectId and section are required" }, { status: 400 });
  }

  const admin = getAdminSupabaseClient();
  const { data: project } = await admin.from("projects").select("name, description, budget, spent").eq("id", projectId).maybeSingle();

  const prompt = `You are a grants specialist writing the ${section} section of a ${grantType ?? "public"} grant. ` +
    `Project: ${project?.name ?? "Unknown"}. Description: ${project?.description ?? "N/A"}. ` +
    `Budget: $${project?.budget ?? 0} with ${project?.spent ?? 0} spent. Context from planner: ${context ?? "None"}. ` +
    `Write 2-3 concise paragraphs referencing safety, equity, climate, and deliverability.`;

  const model = openai("gpt-4o-mini") as unknown as LanguageModelV1;
  const { text } = await generateText({
    model,
    prompt,
    temperature: 0.4,
  });

  return NextResponse.json({ text });
}
