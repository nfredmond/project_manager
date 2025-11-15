import Link from "next/link";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { Badge } from "@/components/ui/badge";

export default function UpdatePasswordPage() {
  return (
    <div>
      <Badge variant="outline" className="mb-4">
        Project Manager
      </Badge>
      <h1 className="text-2xl font-semibold">Set a new password</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Enter a strong passphrase to protect your workspace access.
      </p>
      <UpdatePasswordForm />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Return to{" "}
        <Link className="font-semibold text-primary" href="/login">
          sign in
        </Link>
        .
      </p>
    </div>
  );
}
