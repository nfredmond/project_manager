"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createProjectAction } from "@/actions/projects";

const projectStatusOptions = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On hold" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Closed" },
];

export function CreateProjectDrawer() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("draft");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("status", status);
    startTransition(async () => {
      try {
        await createProjectAction(formData);
        toast.success("Project created");
        event.currentTarget.reset();
        setStatus("draft");
        setOpen(false);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to create project");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="project-name">Name</Label>
            <Input id="project-name" name="name" placeholder="Downtown complete streets" required />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-code">Code</Label>
              <Input id="project-code" name="code" placeholder="PRJ-001" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projectStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-budget">Budget</Label>
              <Input id="project-budget" name="budget" type="number" step="0.01" placeholder="5000000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-client">Client</Label>
              <Input id="project-client" name="client" placeholder="City Council" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-description">Summary</Label>
            <Textarea id="project-description" name="description" rows={4} placeholder="Scope, partners, dependencies" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating…" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

