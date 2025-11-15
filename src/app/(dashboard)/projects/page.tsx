import { CreateProjectDrawer } from "@/components/projects/create-project-drawer";
import { ProjectStatusMenu } from "@/components/projects/project-status-menu";
import { getActiveMembership, getProjects } from "@/lib/data-access";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deriveRolePermissions } from "@/lib/data-helpers";

export default async function ProjectsPage() {
  const [projects, membership] = await Promise.all([getProjects(), getActiveMembership()]);
  const permissions = deriveRolePermissions(membership?.role);

  const totalBudget = projects.reduce((sum, project) => sum + Number(project.budget ?? 0), 0);
  const totalSpent = projects.reduce((sum, project) => sum + Number(project.spent ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p