import { CreateProjectDrawer } from "@/components/projects/create-project-drawer";
import { ProjectStatusMenu } from "@/components/projects/project-status-menu";
import { getActiveMembership, getProjects } from "@/lib/data-access";
import { deriveRolePermissions } from "@/lib/data-helpers";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const statusCopy: Record<string, string> = {
  draft: "Draft plan",
  active: "In delivery",
  on_hold: "Paused",
  completed: "Wrapped",
  closed: "Closed out",
};

export default async function ProjectsPage() {
  const [projects, membership] = await Promise.all([getProjects(), getActiveMembership()]);
  const permissions = deriveRolePermissions(membership?.role ?? null);

  const totalBudget = projects.reduce((sum, project) => sum + Number(project.budget ?? 0), 0);
  const totalSpent = projects.reduce((sum, project) => sum + Number(project.spent ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Capital program</p>
          <h1 className="text-3xl font-semibold">Projects & delivery</h1>
        </div>
        {permissions.canEditProjects && <CreateProjectDrawer />}
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total budget</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(totalBudget)}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Across all tracked projects</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Funds spent</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(totalSpent)}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {totalBudget > 0 ? `${Math.round((totalSpent / totalBudget) * 100)}% of total` : "No spend recorded"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active projects</CardDescription>
            <CardTitle className="text-3xl">{projects.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">With schedule + budget fields</CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Portfolio tracker</CardTitle>
            <CardDescription>Budgets, status, and PED targets per project.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>PED</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id} className="align-top">
                  <TableCell>
                    <div className="font-medium">{project.name}</div>
                    <p className="text-xs text-muted-foreground">{project.code}</p>
                  </TableCell>
                  <TableCell>{formatCurrency(project.budget)}</TableCell>
                  <TableCell>{formatCurrency(project.spent)}</TableCell>
                  <TableCell className="space-y-2">
                    <Badge variant={project.status === "active" ? "secondary" : "outline"}>{project.status}</Badge>
                    <p className="text-xs text-muted-foreground">{statusCopy[project.status] ?? ""}</p>
                    {permissions.canEditProjects && (
                      <ProjectStatusMenu projectId={project.id} status={project.status} />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(project.ped)}</div>
                    <p className="text-xs text-muted-foreground">{formatDate(project.end_date)}</p>
                  </TableCell>
                </TableRow>
              ))}
              {projects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    No projects yet. {permissions.canEditProjects ? "Create one to get started." : "Ask an admin to add you."}
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
