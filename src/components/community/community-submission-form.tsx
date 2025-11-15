"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  tenantSlug: string;
}

export function CommunitySubmissionForm({ tenantSlug }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = Object.fromEntries(data.entries());
    setLoading(true);
    try {
      const res = await fetch("/api/community/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: tenantSlug, ...payload }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Unable to submit");
      }
      toast.success("Thanks for your feedback!");
      event.currentTarget.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label>Name (optional)</Label>
          <Input name="display_name" />
        </div>
        <div>
          <Label>Email (optional)</Label>
          <Input type="email" name="email" />
        </div>
      </div>
      <div>
        <Label>Category</Label>
        <Input name="category" placeholder="Safety, bike, transit…" required />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea name="description" rows={4} placeholder="Tell us what you see…" required />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label>Latitude</Label>
          <Input name="latitude" type="number" step="0.0001" />
        </div>
        <div>
          <Label>Longitude</Label>
          <Input name="longitude" type="number" step="0.0001" />
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Sending…" : "Submit input"}
      </Button>
    </form>
  );
}

