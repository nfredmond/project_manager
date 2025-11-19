import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getDashboardMetrics } from "@/lib/data-access";
import { formatCurrency } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";

export async function MetricCards() {
  const metrics = await getDashboardMetrics();
  const burnRate =
    metrics && metrics.total_budget > 0
      ? Math.round((metrics.total_spent / metrics.total_budget) * 100)
      : 0;

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <FadeIn delay={0.1}>
        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardDescription>Active projects</CardDescription>
            <CardTitle className="text-3xl">{metrics?.projects ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Across planning, CEQA, and construction
          </CardContent>
        </Card>
      </FadeIn>
      <FadeIn delay={0.2}>
        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardDescription>Open grants</CardDescription>
            <CardTitle className="text-3xl">{metrics?.open_grants ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Prospecting & drafting stages
          </CardContent>
        </Card>
      </FadeIn>
      <FadeIn delay={0.3}>
        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardDescription>Community inputs</CardDescription>
            <CardTitle className="text-3xl">
              {metrics?.community_inputs ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Awaiting moderation
          </CardContent>
        </Card>
      </FadeIn>
      <FadeIn delay={0.4}>
        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardDescription>Budget burn</CardDescription>
            <CardTitle>{burnRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={burnRate} />
            <p className="mt-2 text-sm text-muted-foreground">
              {formatCurrency(metrics?.total_spent)} of{" "}
              {formatCurrency(metrics?.total_budget)}
            </p>
          </CardContent>
        </Card>
      </FadeIn>
    </section>
  );
}

