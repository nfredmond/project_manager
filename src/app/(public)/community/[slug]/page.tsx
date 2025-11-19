import { notFound } from "next/navigation";
import { Metadata } from "next";
import CommunityMap from "@/components/community/community-map";
import { CommunitySubmissionForm } from "@/components/community/community-submission-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const admin = getAdminSupabaseClient();
  const { data: tenant } = await admin.from("tenants").select("name").eq("slug", slug).maybeSingle();

  return {
    title: `${tenant?.name ?? "Community"} | Public Engagement`,
    description: `Submit feedback for ${tenant?.name} projects.`,
  };
}

export default async function CommunitySlugPage({ params }: Props) {
  const { slug } = await params;
  const admin = getAdminSupabaseClient();
  const { data: tenant } = await admin.from("tenants").select("id, name, slug").eq("slug", slug).maybeSingle();
  if (!tenant) {
    notFound();
  }
  const { data: inputs } = await admin
    .from("community_inputs")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });
  const submissions = inputs ?? [];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <div>
        <p className="text-sm text-muted-foreground">Community input</p>
        <h1 className="text-3xl font-semibold">{tenant.name}</h1>
        <p className="text-sm text-muted-foreground">Share ideas, concerns, or opportunities in your neighborhood.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Map</CardTitle>
          <CardDescription>Recent submissions from residents.</CardDescription>
        </CardHeader>
        <CardContent>{submissions.length ? <CommunityMap inputs={submissions} /> : <p>No submissions yet.</p>}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submit feedback</CardTitle>
          <CardDescription>Tell the project team what you see on the ground.</CardDescription>
        </CardHeader>
        <CardContent>
          <CommunitySubmissionForm tenantSlug={tenant.slug} />
        </CardContent>
      </Card>
    </div>
  );
}
