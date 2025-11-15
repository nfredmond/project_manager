import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import { ACTION_SEVERITY_META, ACTION_TYPE_LABELS, buildActionItems } from "@/lib/data-helpers";
import { dispatchEventNotification } from "@/lib/notifications";
import { formatDate } from "@/lib/utils";

const DEFAULT_TENANT_SLUG = "demo-mpo";

async function fetchTenantData(tenantId: string, admin = getAdminSupabaseClient()) {
  const [projects, grants, phases, meetings, records] = await Promise.all([
    admin.from("projects").select("*").eq("tenant_id", tenantId),
    admin.from("grants").select("*").eq("tenant_id", tenantId),
    admin.from("caltrans_phases").select("*").eq("tenant_id", tenantId),
    admin.from("meetings").select("*").eq("tenant_id", tenantId),
    admin.from("records_requests").select("*").eq("tenant_id", tenantId),
  ]);

  const hasError = [projects, grants, phases, meetings, records].find((result) => result.error);
  if (hasError) {
    throw hasError.error;
  }

  return {
    projects: (projects.data ?? []) as Parameters<typeof buildActionItems>[0]["projects"],
    grants: (grants.data ?? []) as Parameters<typeof buildActionItems>[0]["grants"],
    phases: (phases.data ?? []) as Parameters<typeof buildActionItems>[0]["phases"],
    meetings: (meetings.data ?? []) as Parameters<typeof buildActionItems>[0]["meetings"],
    records: (records.data ?? []) as Parameters<typeof buildActionItems>[0]["records"],
  };
}

export async function POST(request: Request) {
  const token = process.env.ACTION_CENTER_DIGEST_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Server missing ACTION_CENTER_DIGEST_TOKEN" }, { status: 500 });
  }

  const providedToken = request.headers.get("authorization")?.replace("Bearer ", "");
  if (providedToken !== token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? DEFAULT_TENANT_SLUG;
  const dryRun = url.searchParams.get("preview") === "true";

  const admin = getAdminSupabaseClient();
  const { data: tenant, error: tenantError } = await admin.from("tenants").select("id, name, slug").eq("slug", slug).single();
  if (tenantError || !tenant) {
    return NextResponse.json({ error: `Tenant ${slug} not found` }, { status: 404 });
  }

  const datasets = await fetchTenantData(tenant.id, admin);
  const items = buildActionItems(datasets);
  const severityCounts = {
    overdue: items.filter((item) => item.severity === "overdue").length,
    soon: items.filter((item) => item.severity === "soon").length,
    normal: items.filter((item) => item.severity === "normal").length,
  };

  const digestLines =
    items.slice(0, 5).map((item) => {
      const due = item.dueDate ? formatDate(item.dueDate) : "No deadline";
      return `• ${ACTION_TYPE_LABELS[item.type]} – ${item.title} (${ACTION_SEVERITY_META[item.severity].label}, ${due})`;
    }) ?? [];

  const message = [
    `Overdue: ${severityCounts.overdue} | Due soon: ${severityCounts.soon} | Planned: ${severityCounts.normal}`,
    "",
    digestLines.length > 0 ? digestLines.join("\n") : "No tracked deadlines at the moment.",
  ].join("\n");

  if (!dryRun) {
    await dispatchEventNotification({
      title: `Action center digest – ${tenant.name}`,
      message,
    });
  }

  return NextResponse.json({
    sent: !dryRun,
    tenant: tenant.slug,
    totals: severityCounts,
    preview: message,
    items: digestLines.length,
  });
}


