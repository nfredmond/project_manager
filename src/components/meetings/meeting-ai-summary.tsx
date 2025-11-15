"use client";

import { useState, useTransition } from "react";
import type { Meeting } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MeetingSummaryResult {
  summary: string;
  nextSteps: string[];
  risks: string[];
}

interface Props {
  meeting: Meeting;
}

export function MeetingAiSummary({ meeting }: Props) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<MeetingSummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/meetings/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: meeting.title,
            meetingDate: meeting.meeting_date,
            status: meeting.status,
            location: meeting.location,
            agenda: meeting.agenda,
            notes: meeting.notes,
            minutes: meeting.minutes,
            resolutions: meeting.resolutions,
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error ?? "Unable to generate summary");
        }

        const json = (await response.json()) as MeetingSummaryResult;
        setResult(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error while summarizing.");
      }
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setResult(null);
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" type="button" className="w-full">
          AI digest
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>AI digest</DialogTitle>
          <DialogDescription>{meeting.title}</DialogDescription>
        </DialogHeader>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : result ? (
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium">Summary</p>
              <p className="text-muted-foreground">{result.summary}</p>
            </div>
            {result.nextSteps.length > 0 && (
              <div>
                <p className="font-medium">Next steps</p>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {result.nextSteps.map((step, index) => (
                    <li key={`${step}-${index}`}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.risks.length > 0 && (
              <div>
                <p className="font-medium">Risks</p>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {result.risks.map((risk, index) => (
                    <li key={`${risk}-${index}`}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Generate a quick narrative with follow-up actions from GPT-4o mini.
          </p>
        )}
        <DialogFooter>
          <Button onClick={handleGenerate} disabled={isPending}>
            {isPending ? "Summarizing…" : "Generate summary"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


