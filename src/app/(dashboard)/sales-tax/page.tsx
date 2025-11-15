import { getSalesTaxPrograms } from "@/lib/data-access";
import { createSalesTaxProgramAction, updateSalesTaxStatusAction } from "@/actions/sales-tax";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const statuses = ["draft", "active", "sunset", "audit"];

export default async function SalesTaxPage() {
  const programs = await getSalesTaxPrograms();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Measure tracking</p>
          <h1 className="text-3xl font-semibold">Sales tax programs</h1>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Measures</CardTitle>
            <CardDescription>Monitor revenue, expenditures, and reporting status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Measure</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Expenditures</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => {
                  const noteValue =
                    program.report && typeof program.report === "object"
                      ? (program.report as { notes?: string }).notes
                      : undefined;
                  const noteText = typeof noteValue === "string" ? noteValue : "No report";
                  return (
                    <TableRow key={program.id}>
                    <TableCell>
                      <div className="font-medium">{program.measure}</div>
                        <p className="text-xs text-muted-foreground">{noteText}</p>
                    </TableCell>
                    <TableCell>{formatCurrency(program.revenue ?? 0)}</TableCell>
                    <TableCell>{formatCurrency(program.expenditures ?? 0)}</TableCell>
                    <TableCell>
                      <Badge variant={program.status === "active" ? "secondary" : "outline"}>{program.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <form action={updateSalesTaxStatusAction} className="flex items-center justify-end gap-2">
                        <input type="hidden" name="id" value={program.id} />
                        <Select name="status" defaultValue={program.status}>
                          <SelectTrigger className="h-8 text-xs">
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
                        <Button size="sm" variant="outline" type="submit">
                          Save
                        </Button>
                      </form>
                    </TableCell>
                    </TableRow>
                  );
                })}
                {programs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                      No measures configured.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add measure</CardTitle>
            <CardDescription>Track local return programs and compliance.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createSalesTaxProgramAction} className="space-y-3">
              <div>
                <Label>Measure name</Label>
                <Input name="measure" placeholder="Measure M" required />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label>Revenue</Label>
                  <Input type="number" name="revenue" step="100000" />
                </div>
                <div>
                  <Label>Expenditures</Label>
                  <Input type="number" name="expenditures" step="100000" />
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select name="status" defaultValue="draft">
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
                <Label>Notes</Label>
                <Textarea name="report" rows={3} placeholder="Quarterly highlights" />
              </div>
              <Button type="submit" className="w-full">
                Save program
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
