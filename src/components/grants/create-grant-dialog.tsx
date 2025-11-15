"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createGrantAction } from "@/actions/grants";
import { useTransition } from "react";
import { toast } from "sonner";
import { Project } from "@/lib/types";

const stages = ["prospecting", "drafting", "submitted", "awarded", "denied", "reporting"];

export function CreateGrantDialog({ projects }: { projects: Project[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New grant</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create grant</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          action={(formData) =>
            startTransition(async () => {
              try {
                await createGrantAction(formData);
                toast.success("Grant created");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to create grant");
              }
            })
          }
        >
          <div>
            <Label>Name</Label>
            <Input name="name" required />
          </div>
          <div>
            <Label>Project</Label>
            <Select name="project_id">
              <SelectTrigger>
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Stage</Label>
              <Select name="stage" defaultValue="prospecting">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Deadline</Label>
              <Input name="deadline" type="date" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Requested amount</Label>
              <Input name="requested_amount" type="number" />
            </div>
            <div>
              <Label>Match amount</Label>
              <Input name="match_amount" type="number" />
            </div>
          </div>
          <div>
            <Label>Summary</Label>
            <Textarea name="summary" rows={3} />
          </div>
          <Button disabled={isPending} className="w-full">
            {isPending ? "Saving…" : "Save grant"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

