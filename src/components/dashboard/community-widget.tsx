import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { getCommunityInputs } from "@/lib/data-access";
import { FadeIn } from "@/components/ui/fade-in";

const communityCopy: Record<string, string> = {
  new: "New",
  review: "In review",
  approved: "Approved",
  archived: "Archived",
};

export async function CommunityWidget() {
  const inputs = await getCommunityInputs();
  const recentCommunity = inputs.slice(0, 4);

  return (
    <FadeIn delay={0.8}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-4 w-4 text-primary" />
            Community submissions
          </CardTitle>
          <CardDescription>Map feed from the public portal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentCommunity.map((input) => (
            <div key={input.id} className="rounded-lg border p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{input.display_name ?? "Anonymous"}</span>
                <Badge variant="outline">{communityCopy[input.status] ?? input.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{input.category}</p>
              <p className="mt-2 text-sm text-muted-foreground">{input.description}</p>
            </div>
          ))}
          {recentCommunity.length === 0 && (
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}

