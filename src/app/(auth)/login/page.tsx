import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  return (
    <div>
      <Badge variant="outline" className="mb-4">
        Project Manager
      </Badge>
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <p className="mb-6 text-sm text-muted-foreground">Sign in to continue tracking Caltrans compliance.</p>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading form…</p>}>
        <LoginForm />
      </Suspense>
      <p className="mt-3 text-center text-sm">
        <Link className="text-primary underline-offset-2 hover:underline" href="/reset">
          Forgot your password?
        </Link>
      </p>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Need an account?{" "}
        <Link className="font-semibold text-primary" href="/signup">
          Create tenant
        </Link>
      </p>
    </div>
  );
}
