import { NextResponse } from "next/server";
import { generateText } from "ai";
import type { LanguageModelV1 } from "ai";
import { openai } from "@ai-sdk/openai";

function stringifySection(value: unknown) {
  if (!value) return "Not provided";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (typeof entry === "string") return entry;
        if (entry && typeof entry === "object") return JSON.stringify(entry);
        return String(entry);
      })
      .join(" • ");
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch (error) {
      console.error("Unable to stringify section", error);
    }
  }
  return String(value);
}

type MeetingSummaryResponse = {
  summary: string;
  nextSteps: string[];
  risks: string[];
  raw?: string;
};

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload || !payload.title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const { title, meetingDate, status, location, agenda, notes, minutes, resolutions } = payload as Record<string, unknown>;

  const prompt = `You are a public agency board clerk summarizing a planning meeting.
Return strictly valid JSON with keys: summary (<=120 words string), nextSteps (array of 3 bullet strings), risks (array of up to 2 bullet strings).
Meeting data:
- Title: ${title}
- Status: ${status ?? "Unknown"}
- Date: ${meetingDate ?? "Unscheduled"}
- Location: ${location ?? "N/A"}
- Agenda: ${stringifySection(agenda)}
- Notes: ${stringifySection(notes)}
- Minutes: ${stringifySection(minutes)}
- Resolutions: ${stringifySection(resolutions)}`;

  try {
    const model = openai("gpt-4o-mini") as unknown as LanguageModelV1;
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.3,
    });

    let parsed: MeetingSummaryResponse | null = null;
    try {
      parsed = JSON.parse(text) as MeetingSummaryResponse;
    } catch (error) {
      console.warn("Unable to parse AI response as JSON", error);
    }

    const response: MeetingSummaryResponse = {
      summary: parsed?.summary ?? text,
      nextSteps: parsed?.nextSteps ?? [],
      risks: parsed?.risks ?? [],
      raw: text,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Meeting summary failed", error);
    return NextResponse.json({ error: "Unable to generate summary" }, { status: 500 });
  }
}


