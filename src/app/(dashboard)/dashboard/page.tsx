import Link from "next/link";
import {
  getActiveTenant,
  getCaltransPhases,
  getCommunityInputs,
  getDashboardMetrics,
  getGrants,
  getMeetings,
  getProjects,
  getRecordsRequests,
} from "@/lib/data-access";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Leaf, MapPin, Sparkles, Target } from "lucide-react";
import { ACTION_SEVERITY_META, ACTION_TYPE_LABELS, buildActionItems } from "@/lib/data-helpers";

const grantStageCopy: Record<string, string> = {
  prospecting: "Research",
  drafting: "Drafting",
  submitted: "Submitted",
  awarded: "Awarded",
  denied: "Denied",
  reporting: "Reporting",
};

const communityCopy: Record<string, string> = {
  new: "New",
  review: "In review",
  approved: "Approved",
  archived: "Archived",
};

export default async function DashboardPage() {
  const [tenant, metrics, projects, grants, phases, inputs, meetings, records] = await Promise.all([
    getActiveTenant(),
    getDashboardMetrics(),
    getProjects(),
    getGrants(),
    getCaltransPhases(),
    getCommunityInputs(),
    getMeetings(),
    getRecordsRequests(),
  ]);

  const burnRate = metrics && metrics.total_budget > 0 ? Math.round((metrics.total_spent / metrics.total_budget) * 100) : 0;
  const recentCommunity = inputs.slice(0, 4);
  const recentGrants = grants.slice(0, 4);
  const actionItems = buildActionItems({ projects, phases, grants, meetings, records }).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Pipeline + engagement</p>
          <h1 className="text-3xl font-semibold">Caltrans & grants overview</h1>
        </div>
        {tenant && <Badge variant="outline">Tenant · {tenant.name}</Badge>}
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardDescription>Active projects</CardDescription>
            <CardTitle className="text-3xl">{metrics?.projects ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Across planning, CEQA, and construction</CardContent>
        </Card>
        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardDescription>Open grants</CardDescription>
            <CardTitle className="text-3xl">{metrics?.open_grants ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Prospecting & drafting stages</CardContent>
        </Card>
        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardDescription>Community inputs</CardDescription>
            <CardTitle className="text-3xl">{metrics?.community_inputs ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Awaiting moderation</CardContent>
        </Card>
        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardDescription>Budget burn</CardDescription>
            <CardTitle>{burnRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={burnRate} />
            <p className="mt-2 text-sm text-muted-foreground">
              {formatCurrency(metrics?.total_spent)} of {formatCurrency(metrics?.total_budget)}
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-4 w-4 text-primary" />
              Action center
            </CardTitle>
            <CardDescription>Deadlines from LAPM, grants, meetings, and PRA.</CardDescription>
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
                    <p className="text-xs uppercase text-muted-foreground">{ACTION_TYPE_LABELS[item.type] ?? item.type}</p>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={ACTION_SEVERITY_META[item.severity].variant}>
                      {ACTION_SEVERITY_META[item.severity].label}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.dueDate ? formatDate(item.dueDate) : "No deadline"}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">All clear – no pending deadlines.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-4 w-4 text-primary" />
              Caltrans LAPM phases
            </CardTitle>
            <CardDescription>Track E-76 submissions and PED milestones.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>E-76</TableHead>
                  <TableHead>PED Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {phases.slice(0, 6).map((phase) => {
                  const project = projects.find((proj) => proj.id === phase.project_id);
                  return (
                    <TableRow key={phase.id}>
                      <TableCell>
                        <div className="font-medium">{project?.name ?? "Unknown project"}</div>
                        <p className="text-xs text-muted-foreground">{project?.code}</p>
                      </TableCell>
                      <TableCell>{phase.phase}</TableCell>
                      <TableCell>
                        <Badge variant={phase.status === "in_progress" ? "secondary" : "outline"}>{phase.status}</Badge>
                      </TableCell>
                      <TableCell>{phase.e76_number ?? "—"}</TableCell>
                      <TableCell>{formatDate(phase.ped_due_date)}</TableCell>
                    </TableRow>
                  );
                })}
                {phases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                      Add Caltrans phases to monitor PE/RW/CON progress.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
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
            {recentGrants.length === 0 && <p className="text-sm text-muted-foreground">No grants yet.</p>}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-4 w-4 text-primary" />
              Community submissions
            </CardTitle>
            <CardDescription>Map feed from the public portal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCommunity.map((input) => (
              <div key={input.id} className="rounded-lg border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{input.display_name ?? "Anonymous"}</span>
                  <Badge variant="outline">{communityCopy[input.status] ?? input.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{input.category}</p>
                <p className="mt-2 text-sm text-muted-foreground">{input.description}</p>
              </div>
            ))}
            {recentCommunity.length === 0 && <p className="text-sm text-muted-foreground">No submissions yet.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Leaf className="h-4 w-4 text-primary" />
              Environmental milestones
            </CardTitle>
            <CardDescription>Upcoming CEQA/NEPA checkpoints.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {projects.slice(0, 4).map((project) => (
              <div key={project.id} className="rounded-lg border p-3">
                <p className="font-medium">{project.name}</p>
                <p className="text-xs text-muted-foreground">PED {formatDate(project.ped)}</p>
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDate(project.start_date)} – {formatDate(project.end_date)}</span>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-muted-foreground">Add a project to see timeline data.</p>}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
