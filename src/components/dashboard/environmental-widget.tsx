import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Leaf } from "lucide-react";
import { getProjects } from "@/lib/data-access";
import { formatDate } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";

export async function EnvironmentalWidget() {
  const projects = await getProjects();

  return (
    <FadeIn delay={0.9}>
      <Card className="h-full">
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
                <span>
                  {formatDate(project.start_date)} – {formatDate(project.end_date)}
                </span>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-sm text-muted-foreground">Add a project to see timeline data.</p>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}

