import Link from "next/link";
import {
  getActiveTenant,
  getCaltransPhases,
  getGrants,
  getMeetings,
  getProjects,
  getRecordsRequests,
} from "@/lib/data-access";
import { ACTION_SEVERITY_META, ACTION_TYPE_LABELS, buildActionItems } from "@/lib/data-helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

const typeOrder = ["caltrans", "grant", "meeting", "records"] as const;
const severityOrder = ["overdue", "soon", "normal"] as const;

export default async function ActionCenterPage() {
  const [tenant, projects, grants, phases, meetings, records] = await Promise.all([
    getActiveTenant(),
    getProjects(),
    getGrants(),
    getCaltransPhases(),
    getMeetings(),
    getRecordsRequests(),
  ]);

  const items = buildActionItems({ projects, grants, phases, meetings, records });
  const severityGroup = severityOrder.reduce(
    (acc, severity) => {
      acc[severity] = items.filter((item) => item.severity === severity);
      return acc;
    },
    {} as Record<(typeof severityOrder)[number], typeof items>,
  );
  const typeGroup = typeOrder.reduce(
    (acc, type) => {
      acc[type] = items.filter((item) => item.type === type);
      return acc;
    },
    {} as Record<(typeof typeOrder)[number], typeof items>,
  );

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm text-muted-foreground">Deadlines & compliance</p>
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-3xl font-semibold">Action center</h1>
          {tenant && <Badge variant="outline">Tenant · {tenant.name}</Badge>}
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Roll-up of LAPM, grant, meeting, and PRA obligations. Prioritized by due date and severity so your team can
          clear blockers before audits or public deadlines hit.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total tracked items</CardDescription>
            <CardTitle className="text-3xl">{items.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Includes phases, grants, meetings, and PRA requests.
          </CardContent>
        </Card>
        {severityOrder.map((severity) => (
          <Card key={severity}>
            <CardHeader className="pb-2">
              <CardDescription>{ACTION_SEVERITY_META[severity].label}</CardDescription>
              <CardTitle className="text-3xl">{severityGroup[severity].length}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Suggested priority:{" "}
              {severity === "overdue" ? "Resolve immediately." : severity === "soon" ? "Address within two weeks." : "Monitor."}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        {typeOrder.map((type) => (
          <Card key={type}>
            <CardHeader className="pb-2">
              <CardDescription>{ACTION_TYPE_LABELS[type]}</CardDescription>
              <CardTitle className="text-2xl">{typeGroup[type].length}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>
                Overdue:{" "}
                <span className="font-medium">{typeGroup[type].filter((item) => item.severity === "overdue").length}</span>
              </p>
              <p>
                Due soon:{" "}
                <span className="font-medium">{typeGroup[type].filter((item) => item.severity === "soon").length}</span>
              </p>
              <p>
                Planned:{" "}
                <span className="font-medium">{typeGroup[type].filter((item) => item.severity === "normal").length}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>All deadlines</CardTitle>
            <CardDescription>Sorted by urgency. Click through to handle in the source module.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={`${item.type}-${item.id}`}>
                    <TableCell>
                      <div className="font-medium">{item.title}</div>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{ACTION_TYPE_LABELS[item.type]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ACTION_SEVERITY_META[item.severity].variant}>
                        {ACTION_SEVERITY_META[item.severity].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.dueDate ? formatDate(item.dueDate) : "No deadline"}</TableCell>
                    <TableCell>
                      <Link href={item.href} className="text-sm text-primary underline-offset-2 hover:underline">
                        Open module
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                      No tracked deadlines yet. Create projects or meetings to populate this view.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}


