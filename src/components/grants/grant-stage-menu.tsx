"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { updateGrantStageAction } from "@/actions/grants";
import { toast } from "sonner";
import { useTransition } from "react";

const stages = ["prospecting", "drafting", "submitted", "awarded", "denied", "reporting"];

export function GrantStageMenu({ grantId, stage }: { grantId: string; stage: string }) {
  const [isPending, startTransition] = useTransition();

  const setStage = (value: string) => {
    startTransition(async () => {
      try {
        await updateGrantStageAction(grantId, value);
        toast.success("Grant updated");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to update grant");
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending}>
          {stage}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {stages.map((state) => (
          <DropdownMenuItem key={state} onClick={() => setStage(state)}>
            {state}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

