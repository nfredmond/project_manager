import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function MetricCardsSkeleton() {
  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="space-y-1 pb-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-[60px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-[140px]" />
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

export function WidgetSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-[140px]" />
        <Skeleton className="h-4 w-[200px]" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </CardContent>
    </Card>
  );
}

