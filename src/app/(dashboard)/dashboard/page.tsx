import { Suspense } from "react";
import { getActiveTenant } from "@/lib/data-access";
import { Badge } from "@/components/ui/badge";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { ActionCenterWidget } from "@/components/dashboard/action-center-widget";
import { CaltransWidget } from "@/components/dashboard/caltrans-widget";
import { GrantWidget } from "@/components/dashboard/grant-widget";
import { CommunityWidget } from "@/components/dashboard/community-widget";
import { EnvironmentalWidget } from "@/components/dashboard/environmental-widget";
import { MetricCardsSkeleton, WidgetSkeleton } from "@/components/dashboard/skeletons";

async function DashboardHeader() {
  const tenant = await getActiveTenant();
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm text-muted-foreground">Pipeline + engagement</p>
        <h1 className="text-3xl font-semibold">Caltrans & grants overview</h1>
      </div>
      {tenant && <Badge variant="outline">Tenant · {tenant.name}</Badge>}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="h-20" />}>
        <DashboardHeader />
      </Suspense>

      <Suspense fallback={<MetricCardsSkeleton />}>
        <MetricCards />
      </Suspense>

      <Suspense fallback={<WidgetSkeleton />}>
        <ActionCenterWidget />
      </Suspense>

      <section className="grid gap-4 lg:grid-cols-3">
        <Suspense fallback={<WidgetSkeleton />}>
          <CaltransWidget />
        </Suspense>
        <Suspense fallback={<WidgetSkeleton />}>
          <GrantWidget />
        </Suspense>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Suspense fallback={<WidgetSkeleton />}>
          <CommunityWidget />
        </Suspense>
        <Suspense fallback={<WidgetSkeleton />}>
          <EnvironmentalWidget />
        </Suspense>
      </section>
    </div>
  );
}
