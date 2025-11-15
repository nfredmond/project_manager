import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { Badge } from "@/components/ui/badge";

export default function SignupPage() {
  return (
    <div>
      <Badge variant="secondary" className="mb-4">
        1-week MVP
      </Badge>
      <h1 className="text-2xl font-semibold">Launch your planning OS</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Create a tenant to unlock Caltrans LAPM, CEQA, grants, and engagement in one workspace.
      </p>
      <SignupForm />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already onboarded?{" "}
        <Link className="font-semibold text-primary" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
