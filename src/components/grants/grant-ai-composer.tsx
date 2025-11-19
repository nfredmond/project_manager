"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Project } from "@/lib/types";
import { useCompletion } from "ai/react";
import { toast } from "sonner";

const sections = ["Needs statement", "Project description", "Schedule", "Benefits", "Budget narrative"];

export function GrantAIComposer({ projects }: { projects: Project[] }) {
  const [section, setSection] = useState(sections[0]);
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [grantType, setGrantType] = useState("Federal");
  const [context, setContext] = useState("");

  const { completion, complete, isLoading } = useCompletion({
    api: "/api/generate/grant-narrative",
    onError: (error) => toast.error(error.message),
  });

  const generate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!projectId) {
      toast.error("Please select a project");
      return;
    }
    
    try {
      await complete("", {
        body: { projectId, grantType, section, context },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grant narrative assistant</CardTitle>
        <CardDescription>Powered by Vercel AI SDK + OpenAI GPT-4o mini.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={generate}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <Label>Project</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
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
            <div className="space-y-1">
              <Label>Grant type</Label>
              <Input value={grantType} onChange={(event) => setGrantType(event.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Section</Label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((sec) => (
                    <SelectItem key={sec} value={sec}>
                      {sec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Context</Label>
            <Textarea
              value={context}
              onChange={(event) => setContext(event.target.value)}
              placeholder="Key facts, goals, community benefits..."
              rows={4}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate narrative"}
          </Button>
        </form>
        {completion && (
          <div className="mt-4 rounded-md border bg-muted/40 p-4 text-sm whitespace-pre-wrap">{completion}</div>
        )}
      </CardContent>
    </Card>
  );
}
