import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
const TENANT_SLUG = "demo-mpo";

const projects = [
  {
    name: "Mission Creek Complete Streets",
    code: "MC-CS-001",
    client: "City of Arroyo",
    status: "active",
    description: "Traffic calming, bikeways, and transit signal priority across Mission Creek.",
    start_date: "2023-01-15",
    end_date: "2026-08-30",
    ped: "2025-05-01",
    budget: 54000000,
    spent: 18700000,
  },
  {
    name: "Harbor Line Modernization",
    code: "HL-ROW-004",
    client: "Bayview Port Authority",
    status: "on_hold",
    description: "Utility undergrounding and shoreline resilience for the Harbor rail spur.",
    start_date: "2022-06-01",
    end_date: "2025-12-15",
    ped: "2024-10-01",
    budget: 26500000,
    spent: 6400000,
  },
  {
    name: "Pier 7 Ferry Terminal",
    code: "P7-FT-008",
    client: "BayLink",
    status: "draft",
    description: "Terminal modernization, emergency float replacements, and ADA upgrades.",
    start_date: "2024-02-01",
    end_date: "2026-11-30",
    ped: "2025-07-15",
    budget: 18200000,
    spent: 1200000,
  },
];

const grantPipeline = [
  {
    name: "FTA Low-No Fleet Expansion",
    stage: "drafting",
    funding_source: "FTA",
    requested_amount: 18000000,
    deadline: "2025-01-30",
    summary: "Fleet electrification for 20 articulated buses.",
  },
  {
    name: "RAISE: Mission Creek",
    stage: "submitted",
    funding_source: "USDOT",
    requested_amount: 25000000,
    deadline: "2024-05-28",
    summary: "Multimodal corridor upgrades supporting Vision Zero.",
  },
];

const communitySamples = [
  {
    display_name: "Devon from Precita",
    category: "Safety",
    description: "Need better lighting and curb ramps near the plaza.",
    latitude: 37.7543,
    longitude: -122.414,
    status: "review",
  },
  {
    display_name: "Anita",
    category: "Transit",
    description: "Bus stops flood during winter storms—consider raised platforms.",
    latitude: 37.7661,
    longitude: -122.3969,
    status: "new",
  },
  {
    display_name: "Sam",
    category: "Bike",
    description: "Add protected lanes connecting to Harbor Market.",
    latitude: 37.8001,
    longitude: -122.38,
    status: "approved",
  },
];

async function upsertTenant() {
  const { data, error } = await supabase.from("tenants").select("id").eq("slug", TENANT_SLUG).maybeSingle();
  if (error) throw error;
  if (data) return data.id;
  const { data: inserted, error: insertError } = await supabase
    .from("tenants")
    .insert({ name: "Demo Metropolitan Planning Org", slug: TENANT_SLUG })
    .select("id")
    .single();
  if (insertError) throw insertError;
  return inserted.id;
}

async function clearExisting(tenantId) {
  const tables = [
    "community_inputs",
    "caltrans_phases",
    "grants",
    "projects",
  ];
  for (const table of tables) {
    const { error } = await supabase.from(table).delete().eq("tenant_id", tenantId);
    if (error) throw error;
  }
}

async function seed() {
  const tenantId = await upsertTenant();
  await clearExisting(tenantId);

  const { data: insertedProjects, error: projectsError } = await supabase
    .from("projects")
    .insert(projects.map((project) => ({ ...project, tenant_id: tenantId })))
    .select("id, code");
  if (projectsError) throw projectsError;

  const projectMap = Object.fromEntries(insertedProjects.map((project) => [project.code, project.id]));

  const phasesPayload = [
    {
      code: "MC-CS-001",
      phase: "PE",
      status: "in_progress",
      e76_number: "E76-23-451",
      ped_due_date: "2025-05-01",
      ps_e_certified: true,
    },
    {
      code: "HL-ROW-004",
      phase: "RW",
      status: "planned",
      e76_number: null,
      ped_due_date: "2024-10-01",
      ps_e_certified: false,
    },
    {
      code: "P7-FT-008",
      phase: "CON",
      status: "planned",
      e76_number: null,
      ped_due_date: "2025-07-15",
      ps_e_certified: false,
    },
  ].map((phase) => ({
    tenant_id: tenantId,
    project_id: projectMap[phase.code],
    phase: phase.phase,
    status: phase.status,
    e76_number: phase.e76_number,
    ped_due_date: phase.ped_due_date,
    ps_e_certified: phase.ps_e_certified,
  }));

  const { error: phasesError } = await supabase.from("caltrans_phases").insert(phasesPayload);
  if (phasesError) throw phasesError;

  const grantPayload = grantPipeline.map((grant) => ({
    ...grant,
    tenant_id: tenantId,
    project_id: projectMap["MC-CS-001"],
  }));
  const { error: grantError } = await supabase.from("grants").insert(grantPayload);
  if (grantError) throw grantError;

  const communityPayload = communitySamples.map((input) => ({
    ...input,
    tenant_id: tenantId,
    source: "portal",
    category: input.category,
  }));
  const { error: communityError } = await supabase.from("community_inputs").insert(communityPayload);
  if (communityError) throw communityError;

  console.log("Seed data loaded for", TENANT_SLUG);
}

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
