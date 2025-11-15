import { getDocuments, getProjects } from "@/lib/data-access";
import { DocumentUploadDialog } from "@/components/documents/document-upload-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function DocumentsPage() {
  const [documents, projects] = await Promise.all([getDocuments(), getProjects()]);
  const storageBase = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`
    : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Document library</p>
          <h1 className="text-3xl font-semibold">Contracts, invoices, and CEQA files</h1>
        </div>
        <DocumentUploadDialog projects={projects} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Repository</CardTitle>
          <CardDescription>Version-controlled docs stored in Supabase buckets.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => {
                const project = projects.find((proj) => proj.id === document.project_id);
                return (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="font-medium">{document.title}</div>
                      <p className="text-xs text-muted-foreground">Version {document.version}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{document.category}</Badge>
                    </TableCell>
                    <TableCell>{project?.name ?? "—"}</TableCell>
                    <TableCell>{formatDate(document.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Link
                        className="text-sm text-primary hover:underline"
                        href={storageBase ? `${storageBase}${document.storage_path}` : "#"}
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
              {documents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    No documents uploaded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
