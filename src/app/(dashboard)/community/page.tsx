import CommunityMap from "@/components/community/community-map";
import { getCommunityInputs } from "@/lib/data-access";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { updateCommunityStatusAction } from "@/actions/community";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

const statuses = ["new", "review", "approved", "archived"];

export default async function CommunityPage() {
  const inputs = await getCommunityInputs();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Public engagement</p>
          <h1 className="text-3xl font-semibold">Community map + moderation</h1>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Map view</CardTitle>
            <CardDescription>Plot submissions by category and location.</CardDescription>
          </CardHeader>
          <CardContent>{inputs.length ? <CommunityMap inputs={inputs} /> : <p>No submissions yet.</p>}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderation queue</CardTitle>
            <CardDescription>Review, categorize, and approve messages before publishing.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inputs.map((input) => (
                  <TableRow key={input.id}>
                    <TableCell>
                      <div className="font-medium">{input.category}</div>
                      <p className="text-xs text-muted-foreground">
                        {input.display_name ?? "Anonymous"} · {formatDate(input.created_at)}
                      </p>
                      <p className="text-sm text-muted-foreground">{input.description}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={input.status === "approved" ? "secondary" : "outline"}>{input.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <form action={updateCommunityStatusAction} className="space-y-1">
                        <input type="hidden" name="id" value={input.id} />
                        <Label className="sr-only">Status</Label>
                        <Select name="status" defaultValue={input.status}>
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
                        <Button type="submit" size="sm" variant="outline">
                          Update
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
                {inputs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                      No submissions yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
