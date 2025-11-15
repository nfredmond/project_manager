import { getActiveMembership, getGrants, getProjects } from "@/lib/data-access";
import { GrantAIComposer } from "@/components/grants/grant-ai-composer";
import { CreateGrantDialog } from "@/components/grants/create-grant-dialog";
import { GrantStageMenu } from "@/components/grants/grant-stage-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { deriveRolePermissions } from "@/lib/data-helpers";

const stageCopy: Record<string, string> = {
  prospecting: "Research window",
  drafting: "Narrative under development",
  submitted: "Awaiting award",
  awarded: "Celebrate! Reporting begins",
  denied: "Consider resubmittal",
  reporting: "Claims + deliverables",
};

export default async function GrantsPage() {
  const [grants, projects, membership] = await Promise.all([getGrants(), getProjects(), getActiveMembership()]);
  const permissions = deriveRolePermissions(membership?.role ?? null);

  const openPipeline = grants.filter((grant) => !["awarded", "denied"].includes(grant.stage));
  const awards = grants.filter((grant) => grant.stage === "awarded");
  const totalAsk = grants.reduce((sum, grant) => sum + Number(grant.requested_amount ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Grants & funding</p>
          <h1 className="text-3xl font-semibold">Pipeline + AI narratives</h1>
        </div>
        {permissions.canEditProjects && <CreateGrantDialog projects={projects} />}
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Active pursuits" value={openPipeline.length} helper="Prospecting & drafting" />
        <SummaryCard label="Awarded grants" value={awards.length} helper="Reporting & closeout" />
        <SummaryCard label="Total request" value={formatCurrency(totalAsk)} helper="All opportunities" />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline</CardTitle>
          <CardDescription>Monitor deadlines, match, and AI-generated content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grant</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grants.map((grant) => (
                <TableRow key={grant.id}>
                  <TableCell>
                    <div className="font-medium">{grant.name}</div>
                    <p className="text-xs text-muted-foreground">
                      {grant.projects?.name ?? "Unassigned"} · {grant.funding_source ?? "Funding source TBD"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline">{grant.stage}</Badge>
                      <p className="text-xs text-muted-foreground">{stageCopy[grant.stage]}</p>
                    </div>
                  </TableCell>
                  <TableCell>{grant.deadline ? formatDate(grant.deadline) : "—"}</TableCell>
                  <TableCell>{grant.requested_amount ? formatCurrency(grant.requested_amount) : "—"}</TableCell>
                  <TableCell>
                    {permissions.canEditProjects ? (
                      <GrantStageMenu grantId={grant.id} stage={grant.stage} />
                    ) : (
                      <span className="text-xs text-muted-foreground">View only</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {grants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    No grants yet. Add your first opportunity.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
            <p>
              <span className="font-semibold">{awards.length}</span> awarded grants totalling {formatCurrency(
                awards.reduce((sum, grant) => sum + Number(grant.requested_amount ?? 0), 0),
              )}
            </p>
            <p>
              <span className="font-semibold">{openPipeline.length}</span> opportunities awaiting GPT narratives
            </p>
            <p>
              {grants.filter((grant) => grant.deadline && new Date(grant.deadline) > new Date()).length} upcoming deadlines
              this quarter
            </p>
          </div>
        </CardContent>
      </Card>

      <GrantAIComposer projects={projects} />
    </div>
  );
}

function SummaryCard({ label, value, helper }: { label: string; value: string | number; helper: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{helper}</CardContent>
    </Card>
  );
}
