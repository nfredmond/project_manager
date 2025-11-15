import Link from "next/link";
import { notFound } from "next/navigation";
import { AcceptInviteButton } from "@/components/invitations/accept-invite-button";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function AcceptInvitePage({ params }: Props) {
  const { token } = await params;
  if (!token) {
    notFound();
  }
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <Badge variant="outline" className="mb-2">
        Project Manager
      </Badge>
      <h1 className="text-3xl font-semibold">Join workspace</h1>
      <p className="text-sm text-muted-foreground">
        Accept the invitation to collaborate on Caltrans reporting, grants, and community engagement.
      </p>
      <Card>
        <CardContent className="space-y-4 p-6">
          {user ? (
            <>
              <p className="text-sm text-muted-foreground">
                You are signed in as <span className="font-medium text-foreground">{user.email}</span>.
              </p>
              <AcceptInviteButton token={token} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Please{" "}
              <Link className="font-semibold text-primary" href={`/login?redirect_to=/invite/${token}`}>
                sign in
              </Link>{" "}
              or{" "}
              <Link className="font-semibold text-primary" href={`/signup`}>
                create an account
              </Link>{" "}
              before accepting the invitation.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
