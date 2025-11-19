import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { getGrants } from "@/lib/data-access";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";

const grantStageCopy: Record<string, string> = {
  prospecting: "Research",
  drafting: "Drafting",
  submitted: "Submitted",
  awarded: "Awarded",
  denied: "Denied",
  reporting: "Reporting",
};

export async function GrantWidget() {
  const grants = await getGrants();
  const recentGrants = grants.slice(0, 4);

  return (
    <FadeIn delay={0.7}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-4 w-4 text-primary" />
            Grant pipeline
          </CardTitle>
          <CardDescription>AI-ready narratives & deadlines.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentGrants.map((grant) => (
            <div key={grant.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between text-sm">
                <p className="font-medium">{grant.name}</p>
                <Badge variant="outline">{grantStageCopy[grant.stage] ?? grant.stage}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Due {formatDate(grant.deadline)}</p>
              <p className="text-sm mt-2">
                {grant.projects?.name ?? "Unassigned"} · {formatCurrency(grant.requested_amount)}
              </p>
            </div>
          ))}
          {recentGrants.length === 0 && (
            <p className="text-sm text-muted-foreground">No grants yet.</p>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}

