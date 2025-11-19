import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Target } from "lucide-react";
import { getCaltransPhases, getProjects } from "@/lib/data-access";
import { formatDate } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";

export async function CaltransWidget() {
  const [phases, projects] = await Promise.all([getCaltransPhases(), getProjects()]);

  return (
    <FadeIn delay={0.6} className="lg:col-span-2">
      <Card className="h-full">
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
                      <Badge variant={phase.status === "in_progress" ? "secondary" : "outline"}>
                        {phase.status}
                      </Badge>
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
    </FadeIn>
  );
}

