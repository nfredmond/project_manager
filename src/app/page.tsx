import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  "Caltrans LAPM automation with E-76 status tracking",
  "Grant pipeline + AI narrative assistant",
  "CEQA/NEPA factor checklist & document templates",
  "Community engagement map with public portal",
];

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen w/full max-w-6xl flex-col gap-10 px-6 py-12">
      <div className="rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-background p-8 text-center shadow-sm">
        <Badge variant="secondary" className="mb-4">
          California Planning MVP
        </Badge>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
          The operating system for Caltrans compliance, grants, and community engagement.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Project Manager unifies LAPM, CEQA, grant reporting, and public outreach so multi-tenant agencies stay audit-ready
          without juggling spreadsheets.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/signup">Create tenant</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {highlights.map((item) => (
          <Card key={item}>
            <CardContent className="p-6">
              <p className="text-base font-medium">{item}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
