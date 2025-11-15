import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import { dispatchEventNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  const body = await request.json();
  const { slug, display_name, email, category, description, latitude, longitude } = body;
  if (!slug || !category) {
    return NextResponse.json({ error: "Missing slug or category" }, { status: 400 });
  }

  const admin = getAdminSupabaseClient();
  const { data: tenant, error: tenantError } = await admin.from("tenants").select("id, name").eq("slug", slug).maybeSingle();
  if (tenantError || !tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  const payload = {
    tenant_id: tenant.id,
    display_name,
    email,
    category,
    description,
    latitude,
    longitude,
    status: "new",
    source: "portal",
  };

  const { error: insertError } = await admin.from("community_inputs").insert(payload);
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  await dispatchEventNotification({
    title: "New community input",
    message: `${category} submission for ${tenant.name}`,
  });

  return NextResponse.json({ success: true });
}
