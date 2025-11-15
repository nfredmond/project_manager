import { getGrants, getProjects } from "@/lib/data-access";
import { AnalyticsChart } from "@/components/reports/analytics-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default async function ReportsPage() {
  const [projects, grants] = await Promise.all([getProjects(), getGrants()]);
  const chartData = projects.map((project) => ({
    label: project.code ?? project.name,
    budget: Number(project.budget ?? 0),
    spent: Number(project.spent ?? 0),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Analytics & exports</p>
          <h1 className="text-3xl font-semibold">Portfolio reporting</h1>
        </div>
        <Link href="/api/reports/summary/pdf" className="text-sm text-primary hover:underline">
          Download PDF summary
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget vs. spend</CardTitle>
          <CardDescription>Compare allocations by project code.</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? <AnalyticsChart data={chartData} /> : <p>No project data yet.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grant scoreboard</CardTitle>
          <CardDescription>Snapshot of pipeline health.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grant</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Request</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grants.map((grant) => (
                <TableRow key={grant.id}>
                  <TableCell>{grant.name}</TableCell>
                  <TableCell>{grant.stage}</TableCell>
                  <TableCell>{grant.projects?.name ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    {grant.requested_amount ? formatCurrency(grant.requested_amount) : "—"}
                  </TableCell>
                </TableRow>
              ))}
              {grants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                    No grants available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
