"use client";

import { useState, useTransition } from "react";
import { createInvitationAction } from "@/actions/invitations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const roleOptions = [
  { value: "manager", label: "Manager (approvals + edits)" },
  { value: "editor", label: "Editor (create + edit)" },
  { value: "viewer", label: "Viewer (read-only)" },
];

export function InviteMembersCard() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      try {
        const result = await createInvitationAction({ email, role });
        setInviteLink(result.inviteUrl);
        toast.success("Invitation created");
        setEmail("");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to create invitation");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite teammates</CardTitle>
        <CardDescription>Generate a secure link and share it via email or Slack.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="planner@agency.gov"
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating…" : "Generate invite"}
          </Button>
        </form>
        {inviteLink && (
          <div className="mt-4 rounded-md border bg-muted/30 p-3 text-sm">
            <p className="font-medium">Share this link:</p>
            <p className="truncate text-primary">{inviteLink}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

