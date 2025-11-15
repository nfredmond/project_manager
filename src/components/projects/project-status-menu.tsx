"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateProjectStatusAction } from "@/actions/projects";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On hold" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Closed" },
];

interface Props {
  projectId: string;
  status: string;
}

export function ProjectStatusMenu({ projectId, status }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextStatus: string) => {
    startTransition(async () => {
      try {
        await updateProjectStatusAction(projectId, nextStatus);
        toast.success("Project status updated");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to update status");
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {STATUS_OPTIONS.map((option) => (
          <DropdownMenuItem key={option.value} onSelect={() => handleChange(option.value)}>
            <span className="flex flex-1 items-center justify-between">
              {option.label}
              {option.value === status && <Check className="h-4 w-4 text-primary" />}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

