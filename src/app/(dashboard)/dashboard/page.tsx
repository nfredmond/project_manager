import { getActiveTenant, getCaltransPhases, getCommunityInputs, getDashboardMetrics, getGrants, getProjects } from "@/lib/data-access";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Leaf, MapPin, Target } from "lucide-react";

export default async function DashboardPage() {
  const [tenant, metrics, projects, grants, phases, inputs] = await Promise.all([
    getActiveTenant(),
    getDashboardMetrics(),
    getProjects(),
    getGrants(),
    getCaltransPhases(),
    getCommunityInputs(),
  ]);

  const burnRate = metrics && metrics.total_budget > 0 ? Math.round((metrics.total_spent / metrics.total_budget) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Good morning</p>
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

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-4 w-4 text-primary" />
              Caltrans LAPM phases
            </CardTitle>
            <CardDescription>Track E-76 and PED milestones per project.</CardDescription>
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
              <SparklesIcon />
              Grant pipeline
            </CardTitle>
            <CardDescription>AI-ready narratives & deadlines.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {grants.slice(0, 5).map((grant) => (
              <div key={grant.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between text-sm">
                  <p className="font-med