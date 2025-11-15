import { getActiveTenant, getCaltransInvoices, getCaltransPhases, getProjects } from "@/lib/data-access";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { createCaltransInvoiceAction, createCaltransPhaseAction } from "@/actions/caltrans";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const phases = ["PE", "RW", "RW_UTIL", "CON", "CE"];
const statuses = ["planned", "authorized", "in_progress", "submitted", "closed"];

export default async function CaltransPage() {
  const [tenant, projects, lapmPhases, invoices] = await Promise.all([
    getActiveTenant(),
    getProjects(),
    getCaltransPhases(),
    getCaltransInvoices(),
  ]);

  const totalFederal = lapmPhases.reduce((sum, phase) => sum + Number(phase.federal_funds ?? 0), 0);
  const totalState = lapmPhases.reduce((sum, phase) => sum + Number(phase.state_funds ?? 0), 0);
  const totalLocal = lapmPhases.reduce((sum, phase) => sum + Number(phase.local_funds ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Caltrans LAPM</p>
          <h1 className="text-3xl font-semibold">Authorization & invoicing</h1>
        </div>
        {tenant && <Badge variant="outline">Caltrans contact · {tenant.name}</Badge>}
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Authorizations" value={lapmPhases.length} helper="PE/RW/CON phases" />
        <SummaryCard label="Federal funds" value={formatCurrency(totalFederal)} helper="Authorized to date" />
        <SummaryCard label="State funds" value={formatCurrency(totalState)} helper="State share" />
        <SummaryCard label="Local match" value={formatCurrency(totalLocal)} helper="Local contribution" />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Phase tracker</CardTitle>
            <CardDescription>Monitor E-76 approvals, PS&E status, and DBE goals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>E-76</TableHead>
                  <TableHead>PED</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lapmPhases.map((phase) => {
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
                {lapmPhases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                      No LAPM phases yet. Add one using the form.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add phase</CardTitle>
            <CardDescription>Log E-76 authorization with funds + PED date.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCaltransPhaseAction} className="space-y-3">
              <div className="space-y-1">
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
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <Label>Phase</Label>
                  <Select name="phase" defaultValue="PE">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {phases.map((phase) => (
                        <SelectItem key={phase} value={phase}>
                          {phase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Status</Label>
                  <Select name="status" defaultValue="planned">
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
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label>E-76</Label>
                  <Input name="e76_number" placeholder="E76-2024-123" />
                </div>
                <div>
                  <Label>PED due</Label>
                  <Input type="date" name="ped_due_date" />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <Label>Federal</Label>
                  <Input type="number" step="1000" name="federal_funds" />
                </div>
                <div>
                  <Label>State</Label>
                  <Input type="number" step="1000" name="state_funds" />
                </div>
                <div>
                  <Label>Local</Label>
                  <Input type="number" step="1000" name="local_funds" />
                </div>
              </div>
              <div>
                <Label>DBE goal (%)</Label>
                <Input type="number" step="0.1" name="dbe_goal" />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea name="notes" rows={3} />
              </div>
              <Button type="submit" className="w-full">
                Save phase
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Invoice log</CardTitle>
            <CardDescription>Track LAPM 5-A invoices and download PDFs.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const project = projects.find((proj) => proj.id === invoice.project_id);
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div className="font-medium">{invoice.invoice_number}</div>
                        <p className="text-xs text-muted-foreground">
                          {project?.name} · {invoice.phase}
                        </p>
                      </TableCell>
                      <TableCell>
                        {formatDate(invoice.period_start)} – {formatDate(invoice.period_end)}
                      </TableCell>
                      <TableCell>{formatCurrency(invoice.total_amount)}</TableCell>
                      <TableCell className="text-right">
                        <Link
                          className="text-sm text-primary hover:underline"
                          href={`/api/caltrans/invoices/${invoice.id}/pdf`}
                        >
                          Download PDF
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                      No invoices submitted.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submit invoice</CardTitle>
            <CardDescription>Share costs across federal, state, and local shares.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCaltransInvoiceAction} className="space-y-3">
              <div className="space-y-1">
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
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <Label>Phase</Label>
                  <Select name="phase" defaultValue="CON">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {phases.map((phase) => (
                        <SelectItem key={phase} value={phase}>
                          {phase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Invoice #</Label>
                  <Input name="invoice_number" placeholder="LAPM-5A-001" required />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label>Period start</Label>
                  <Input type="date" name="period_start" required />
                </div>
                <div>
                  <Label>Period end</Label>
                  <Input type="date" name="period_end" required />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label>Total amount</Label>
                  <Input type="number" step="100" name="total_amount" required />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select name="status" defaultValue="draft">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <Label>Federal share</Label>
                  <Input type="number" step="100" name="federal_share" />
                </div>
                <div>
                  <Label>State share</Label>
                  <Input type="number" step="100" name="state_share" />
                </div>
                <div>
                  <Label>Local share</Label>
                  <Input type="number" step="100" name="local_share" />
                </div>
              </div>
              <div>
                <Label>Supporting doc URL</Label>
                <Input name="document_url" placeholder="https://example.com/invoice.pdf" />
              </div>
              <Button type="submit" className="w-full">
                Submit invoice
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
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

