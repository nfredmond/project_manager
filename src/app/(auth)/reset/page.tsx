import Link from "next/link";
import { RequestResetForm } from "@/components/auth/request-reset-form";
import { Badge } from "@/components/ui/badge";

export default function ResetPasswordPage() {
  return (
    <div>
      <Badge variant="outline" className="mb-4">
        Project Manager
      </Badge>
      <h1 className="text-2xl font-semibold">Forgot password</h1>
      <p className="mb-6 text-sm text-muted-foreground">Enter your email and we will send a secure reset link.</p>
      <RequestResetForm />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link className="font-semibold text-primary" href="/login">
          Go back to sign in
        </Link>
      </p>
    </div>
  );
}
