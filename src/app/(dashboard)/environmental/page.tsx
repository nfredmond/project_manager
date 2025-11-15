import { getEnvironmentalFactors, getProjects } from "@/lib/data-access";
import { upsertEnvironmentalFactorAction } from "@/actions/environmental";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

const factorList = [
  "Aesthetics",
  "Agriculture",
  "Air quality",
  "Biological resources",
  "Cultural resources",
  "Energy",
  "Geology",
  "Greenhouse gas",
  "Hazards",
  "Hydrology",
  "Land use",
  "Mineral resources",
  "Noise",
  "Population & housing",
  "Public services",
  "Recreation",
  "Transportation",
  "Utilities & service systems",
];

const statuses = ["not_started", "in_progress", "drafting", "complete", "mitigation"];

export default async function EnvironmentalPage() {
  const [factors, projects] = await Promise.all([getEnvironmentalFactors(), getProjects()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">CEQA / NEPA</p>
          <h1 className="text-3xl font-semibold">Appendix G checklist</h1>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Factors</CardTitle>
            <CardDescription>Track significance findings, mitigation, and lead agency coordination.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {factors.map((factor) => {
                  const project = projects.find((proj) => proj.id === factor.project_id);
                  return (
                    <TableRow key={`${factor.project_id}-${factor.factor}`}>
                      <TableCell>
                        <div className="font-medium">{factor.factor}</div>
                        <p className="text-xs text-muted-foreground">{factor.mitigation ?? "No mitigation"}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={factor.status === "mitigation" ? "secondary" : "outline"}>{factor.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{project?.name ?? "Unknown project"}</p>
                        <p className="text-xs text-muted-foreground">Lead agency: {factor.lead_agency ?? "TBD"}</p>
                      </TableCell>
                      <TableCell>{formatDate(factor.due_date)}</TableCell>
                    </TableRow>
                  );
                })}
                {factors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                      No factors tracked yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add / update factor</CardTitle>
            <CardDescription>Appendix G factors deduplicated per project.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={upsertEnvironmentalFactorAction} className="space-y-3">
              <div>
                <Label>Project</Label>
                <Select name="project_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Factor</Label>
                <Select name="factor" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select factor" />
                  </SelectTrigger>
                  <SelectContent>
                    {factorList.map((factor) => (
                      <SelectItem key={factor} value={factor}>
                        {factor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select name="status" defaultValue="not_started">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Lead agency</Label>
                <Input name="lead_agency" placeholder="Caltrans District 4" />
              </div>
              <div>
                <Label>Significance</Label>
                <Input name="significance" placeholder="Less than significant with mitigation" />
              </div>
              <div>
                <Label>Mitigation</Label>
                <Textarea name="mitigation" rows={3} placeholder="Describe measures" />
              </div>
              <div>
                <Label>CEQA doc URL</Label>
                <Input name="doc_url" placeholder="https://example.com/nod.pdf" />
              </div>
              <div>
                <Label>Due date</Label>
                <Input type="date" name="due_date" />
              </div>
              <Button type="submit" className="w-full">
                Save factor
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
