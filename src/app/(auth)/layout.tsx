import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-sm">{children}</div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Built for Caltrans LAPM, CEQA, and grant-ready teams.
      </p>
    </div>
  );
}
