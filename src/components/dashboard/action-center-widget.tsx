import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import {
  getCaltransPhases,
  getGrants,
  getMeetings,
  getProjects,
  getRecordsRequests,
} from "@/lib/data-access";
import { ACTION_SEVERITY_META, ACTION_TYPE_LABELS, buildActionItems } from "@/lib/data-helpers";
import { formatDate } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";

export async function ActionCenterWidget() {
  const [projects, grants, phases, meetings, records] = await Promise.all([
    getProjects(),
    getGrants(),
    getCaltransPhases(),
    getMeetings(),
    getRecordsRequests(),
  ]);

  const actionItems = buildActionItems({
    projects,
    phases,
    grants,
    meetings,
    records,
  }).slice(0, 5);

  return (
    <FadeIn delay={0.5}>
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-4 w-4 text-primary" />
              Action center
            </CardTitle>
            <CardDescription>
              Deadlines from LAPM, grants, meetings, and PRA.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {actionItems.length > 0 ? (
              actionItems.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg border p-3 transition hover:bg-muted/70"
                >
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      {ACTION_TYPE_LABELS[item.type] ?? item.type}
                    </p>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={ACTION_SEVERITY_META[item.severity].variant}
                    >
                      {ACTION_SEVERITY_META[item.severity].label}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.dueDate ? formatDate(item.dueDate) : "No deadline"}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                All clear – no pending deadlines.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </FadeIn>
  );
}

