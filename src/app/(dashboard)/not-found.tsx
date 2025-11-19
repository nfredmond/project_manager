import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <FileQuestion className="h-6 w-6" />
        <h2 className="text-xl font-semibold">Page not found</h2>
      </div>
      <p className="text-muted-foreground">
        The page you are looking for does not exist or you do not have permission to view it.
      </p>
      <Button asChild variant="outline">
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}

