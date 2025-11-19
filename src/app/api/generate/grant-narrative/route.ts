import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { projectId, grantType, section, context } = await request.json();

  const admin = getAdminSupabaseClient();
  const { data: project } = await admin
    .from("projects")
    .select("name, description, budget, spent")
    .eq("id", projectId)
    .maybeSingle();

  const prompt =
    `You are a grants specialist writing the ${section} section of a ${grantType ?? "public"} grant. ` +
    `Project: ${project?.name ?? "Unknown"}. Description: ${project?.description ?? "N/A"}. ` +
    `Budget: $${project?.budget ?? 0} with ${project?.spent ?? 0} spent. Context from planner: ${
      context ?? "None"
    }. ` +
    `Write 2-3 concise paragraphs referencing safety, equity, climate, and deliverability.`;

  const result = streamText({
    model: openai("gpt-4o-mini"),
    prompt,
    temperature: 0.4,
  });

  return result.toDataStreamResponse();
}
