import { getProjects, getRecordsRequests } from "@/lib/data-access";
import { createRecordRequestAction, updateRecordStatusAction } from "@/actions/records";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

const statuses = ["open", "in_progress", "fulfilled", "closed"];

export default async function RecordsRequestsPage() {
  const [requests, projects] = await Promise.all([getRecordsRequests(), getProjects()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Public Records Act</p>
          <h1 className="text-3xl font-semibold">Requests & fulfillment</h1>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active requests</CardTitle>
            <CardDescription>Stay compliant with PRA deadlines.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => {
                  const project = projects.find((proj) => proj.id === request.project_id);
                  return (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="font-medium">{request.topic ?? "Records request"}</div>
                        <p className="text-xs text-muted-foreground">
                          {request.requester} · Received {formatDate(request.received_on)}
                        </p>
                        {project && <p className="text-xs text-muted-foreground">Project: {project.name}</p>}
                      </TableCell>
                      <TableCell>{formatDate(request.due_on)}</TableCell>
                      <TableCell>
                        <Badge variant={request.status === "fulfilled" ? "secondary" : "outline"}>{request.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <form action={updateRecordStatusAction} className="flex items-center justify-end gap-2">
                          <input type="hidden" name="id" value={request.id} />
                          <Select name="status" defaultValue={request.status}>
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
                {requests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                      No requests logged.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Log new request</CardTitle>
            <CardDescription>Capture requester info, due date, and notes.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createRecordRequestAction} className="space-y-3">
              <div>
                <Label>Requester</Label>
                <Input name="requester" required />
              </div>
              <div>
                <Label>Contact info</Label>
                <Input name="contact" placeholder="email or phone" />
              </div>
              <div>
                <Label>Topic</Label>
                <Input name="topic" placeholder="EIR traffic study" />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label>Received</Label>
                  <Input type="date" name="received_on" />
                </div>
                <div>
                  <Label>Due</Label>
                  <Input type="date" name="due_on" />
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select name="status" defaultValue="open">
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
                <Label>Project</Label>
                <Select name="project_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Optional" />
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
                <Label>Notes</Label>
                <Textarea name="notes" rows={3} placeholder="Docs provided, staff assigned, etc." />
              </div>
              <Button type="submit" className="w-full">
                Save request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
