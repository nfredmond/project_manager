"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { acceptInvitationAction } from "@/actions/invitations";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AcceptInviteButton({ token }: { token: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onAccept = () => {
    startTransition(async () => {
      try {
        await acceptInvitationAction(token);
        toast.success("Invitation accepted");
        router.push("/dashboard");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to join workspace");
      }
    });
  };

  return (
    <Button onClick={onAccept} disabled={isPending}>
      {isPending ? "Joining…" : "Accept invitation"}
    </Button>
  );
}

