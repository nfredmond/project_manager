"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createDocumentAction } from "@/actions/documents";
import { toast } from "sonner";
import { Project } from "@/lib/types";

const categories = ["contract", "invoice", "environmental", "grant", "meeting", "caltrans", "other"];

export function DocumentUploadDialog({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filePath, setFilePath] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/uploads/documents", {
        method: "POST",
        body: data,
      });
      if (!res.ok) {
        throw new Error("Upload failed");
      }
      const json = await res.json();
      setFilePath(json.path);
      toast.success("File uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload");
    } finally {
      setUploading(false);
    }
  };

  const submitDocument = async (formData: FormData) => {
    if (!filePath) {
      toast.error("Upload a file first");
      return;
    }
    formData.append("storage_path", filePath);
    try {
      await createDocumentAction(formData);
      toast.success("Document saved");
      setOpen(false);
      setFilePath(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Upload</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload document</DialogTitle>
        </DialogHeader>
        <form action={submitDocument} className="space-y-3">
          <div>
            <Label>File</Label>
            <Input type="file" onChange={handleUpload} disabled={uploading} />
            {filePath && <p className="text-xs text-muted-foreground">Uploaded: {filePath}</p>}
          </div>
          <div>
            <Label>Title</Label>
            <Input name="title" required />
          </div>
          <div>
            <Label>Category</Label>
            <Select name="category" defaultValue="contract">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
          <Button type="submit" disabled={uploading || !filePath} className="w-full">
            Save to library
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

