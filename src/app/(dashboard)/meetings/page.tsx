import { getMeetings, getProjects } from "@/lib/data-access";
import { createMeetingAction, updateMeetingStatusAction } from "@/actions/meetings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

const meetingTypes = ["board", "council", "community", "internal", "task_force"];
const meetingStatuses = ["scheduled", "agenda_posted", "completed", "canceled"];

export default async function MeetingsPage() {
  const [meetings, projects] = await Promise.all([getMeetings(), getProjects()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Governance + engagement</p>
          <h1 className="text-3xl font-semibold">Meetings & resolutions</h1>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming meetings</CardTitle>
            <CardDescription>Post agendas, share recordings, and track status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meeting</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetings.map((meeting) => {
                  const project = projects.find((proj) => proj.id === meeting.project_id);
                  return (
                    <TableRow key={meeting.id}>
                      <TableCell>
                        <div className="font-medium">{meeting.title}</div>
                        <p className="text-xs text-muted-foreground">
                          {meeting.meeting_type} · {project?.name ?? "General"}
                        </p>
                        {meeting.location && <p className="text-xs text-muted-foreground">{meeting.location}</p>}
                      </TableCell>
                      <TableCell>{formatDate(meeting.meeting_date)}</TableCell>
                      <TableCell>
                        <Badge variant={meeting.status === "completed" ? "secondary" : "outline"}>{meeting.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <form action={updateMeetingStatusAction} className="space-y-1">
                          <input type="hidden" name="id" value={meeting.id} />
                          <Select name="status" defaultValue={meeting.status ?? "scheduled"}>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {meetingStatuses.map((status) => (
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
                {meetings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                      No meetings scheduled.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule meeting</CardTitle>
            <CardDescription>Track Brown Act compliance with agendas + links.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createMeetingAction} className="space-y-3">
              <div>
                <Label>Title</Label>
                <Input name="title" placeholder="Board workshop" required />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
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
                  <Label>Type</Label>
                  <Select name="meeting_type" defaultValue="internal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {meetingTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label>Date</Label>
                  <Input type="date" name="meeting_date" required />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select name="status" defaultValue="scheduled">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {meetingStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Location / video link</Label>
                <Input name="location" placeholder="City Hall, Council Chambers" />
              </div>
              <div>
                <Label>Recording URL</Label>
                <Input name="recording_url" placeholder="https://youtu.be/..." />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea name="notes" rows={3} placeholder="Agenda highlights, resolutions, speaker list" />
              </div>
              <Button type="submit" className="w-full">
                Save meeting
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
