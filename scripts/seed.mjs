import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local", override: true });
dotenv.config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const demoUser = {
  email: "demo@projectmanager.local",
  password: "ProjectDemo!23",
  fullName: "Demo Planner",
};

const tenantSeeds = [
  {
    name: "Bayview Mobility Alliance",
    slug: "bayview-mobility",
    timezone: "America/Los_Angeles",
    branding: { accent: "#2563eb" },
    projects: [
      {
        name: "SR-14 Complete Streets",
        code: "BV-CS-014",
        client: "City of Bayview",
        status: "active",
        description: "Multimodal upgrades with buffered bike lanes and transit queue jumps.",
        lead_manager: null,
        start_date: "2024-01-10",
        end_date: "2027-06-30",
        ped: "2026-03-01",
        budget: 54000000,
        spent: 18500000,
        tags: ["complete-streets", "raise"],
      },
      {
        name: "Pier 7 Ferry Terminal",
        code: "BV-FT-007",
        client: "Bayview Port",
        status: "on_hold",
        description: "Terminal modernization and emergency float replacements.",
        start_date: "2023-04-15",
        end_date: "2025-11-01",
        ped: "2025-05-10",
        budget: 26000000,
        spent: 6200000,
        tags: ["ferry", "climate"],
      },
    ],
    caltransPhases: [
      {
        project: "SR-14 Complete Streets",
        phase: "PE",
        status: "in_progress",
        e76_number: "E-76-2024-45",
        authorization_date: "2024-02-20",
        ped_due_date: "2025-09-01",
        federal_funds: 12000000,
        state_funds: 6000000,
        local_funds: 3000000,
        dbe_goal: 13.5,
        ps_e_certified: true,
        notes: "PS&E package 60% comment cycle.",
      },
      {
        project: "SR-14 Complete Streets",
        phase: "CE",
        status: "planned",
        ped_due_date: "2026-03-01",
        dbe_goal: 15,
      },
    ],
    grants: [
      {
        project: "SR-14 Complete Streets",
        name: "RAISE FY25",
        grant_type: "Federal",
        stage: "drafting",
        funding_source: "USDOT",
        deadline: "2025-02-15",
        requested_amount: 25000000,
        match_amount: 5000000,
        summary: "Corridor transformation focusing on safety for vulnerable users.",
      },
      {
        project: "Pier 7 Ferry Terminal",
        name: "FTA Ferry Grant",
        grant_type: "Federal",
        stage: "prospecting",
        funding_source: "FTA",
        deadline: "2025-05-01",
        requested_amount: 12000000,
        match_amount: 3000000,
        summary: "Terminal resiliency and electrification upgrades.",
      },
    ],
    communityInputs: [
      {
        project: "SR-14 Complete Streets",
        category: "Safety",
        description: "Need better lighting near 8th Street bus stop.",
        latitude: 37.7794,
        longitude: -122.414,
        status: "approved",
      },
      {
        project: "Pier 7 Ferry Terminal",
        category: "Access",
        description: "Add more bike parking near ticket plaza.",
        latitude: 37.8083,
        longitude: -122.4108,
        status: "review",
      },
    ],
    meetings: [
      {
        project: "SR-14 Complete Streets",
        title: "Design Advisory Committee",
        meeting_type: "community",
        meeting_date: "2025-01-22T18:00:00-08:00",
        location: "Bayview City Hall",
        status: "scheduled",
      },
    ],
    recordsRequests: [
      {
        project: "SR-14 Complete Streets",
        requester: "Safe Streets Now",
        topic: "Consultant task orders",
        contact: "info@safestreetsnow.org",
        due_on: "2025-01-10",
        status: "in_progress",
      },
    ],
    environmentalFactors: [
      {
        project: "SR-14 Complete Streets",
        factor: "Air quality",
        status: "pending",
        significance: "Less-than-significant with mitigation",
        mitigation: "Nighttime construction limits + dust control plan.",
        due_date: "2025-04-15",
      },
    ],
    salesTaxPrograms: [
      {
        measure: "Measure M",
        revenue: 82000000,
        expenditures: 64000000,
        status: "active",
      },
    ],
  },
  {
    name: "Coastal City Transportation",
    slug: "coastal-city-transport",
    timezone: "America/Los_Angeles",
    branding: { accent: "#0f766e" },
    projects: [
      {
        name: "Harbor Line Streetcar",
        code: "CC-STR-001",
        client: "Coastal City DOT",
        status: "active",
        description: "Reopening heritage streetcar line with battery assist.",
        start_date: "2022-09-01",
        end_date: "2026-12-31",
        ped: "2026-06-30",
        budget: 88000000,
        spent: 50500000,
        tags: ["streetcar", "tourism"],
      },
      {
        name: "Seawall Multiuse Path",
        code: "CC-PATH-009",
        client: "Parks Dept",
        status: "completed",
        description: "12-mile multiuse path with bioswales.",
        start_date: "2021-03-15",
        end_date: "2024-09-30",
        ped: "2023-11-01",
        budget: 42000000,
        spent: 42000000,
        tags: ["path", "climate"],
      },
    ],
    caltransPhases: [
      {
        project: "Harbor Line Streetcar",
        phase: "RW",
        status: "submitted",
        e76_number: "E-76-2023-09",
        authorization_date: "2023-07-18",
        ped_due_date: "2024-11-30",
        federal_funds: 18000000,
        state_funds: 6000000,
        local_funds: 4000000,
        dbe_goal: 12,
        ps_e_certified: true,
      },
      {
        project: "Harbor Line Streetcar",
        phase: "CON",
        status: "authorized",
        e76_number: "E-76-2024-33",
        authorization_date: "2024-08-05",
        ped_due_date: "2025-10-01",
        federal_funds: 48000000,
        state_funds: 6000000,
        local_funds: 4000000,
        dbe_goal: 10,
      },
    ],
    grants: [
      {
        project: "Harbor Line Streetcar",
        name: "FTA Small Starts 2024",
        grant_type: "Federal",
        stage: "reporting",
        funding_source: "FTA",
        deadline: "2025-04-01",
        requested_amount: 55000000,
        summary: "Project is in PMOC reporting phase.",
      },
    ],
    communityInputs: [
      {
        project: "Seawall Multiuse Path",
        category: "Maintenance",
        description: "Storm debris near mile 3 marker after last king tide.",
        latitude: 33.9062,
        longitude: -118.4019,
        status: "approved",
      },
    ],
    meetings: [
      {
        project: "Harbor Line Streetcar",
        title: "Board Workshop – Vehicle Procurement",
        meeting_type: "board",
        meeting_date: "2025-02-12T09:00:00-08:00",
        location: "Coastal City DOT HQ",
        status: "scheduled",
      },
    ],
    recordsRequests: [
      {
        project: "Harbor Line Streetcar",
        requester: "Harbor Chronicle",
        topic: "Vehicle specs and bids",
        contact: "records@harborchronicle.com",
        due_on: "2024-12-19",
        status: "fulfilled",
      },
    ],
    environmentalFactors: [
      {
        project: "Harbor Line Streetcar",
        factor: "Noise",
        status: "mitigated",
        mitigation: "Rubberized trackbeds at sensitive receptors.",
        due_date: "2024-09-15",
      },
    ],
    salesTaxPrograms: [
      {
        measure: "Measure R",
        revenue: 120000000,
        expenditures: 72000000,
        status: "active",
      },
    ],
  },
];

async function findUserByEmail(email) {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) {
    throw new Error(`Unable to list users: ${error.message}`);
  }
  return data.users?.find((user) => user.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

async function ensureDemoUserAccount() {
  const existing = await findUserByEmail(demoUser.email);
  if (existing) {
    return existing;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: demoUser.email,
    password: demoUser.password,
    email_confirm: true,
    user_metadata: { full_name: demoUser.fullName },
  });
  if (error) {
    if (error.message?.includes("already been registered")) {
      const fallback = await findUserByEmail(demoUser.email);
      if (fallback) {
        return fallback;
      }
    }
    throw new Error(`Unable to create demo user: ${error.message}`);
  }
  if (!data.user) {
    throw new Error("Supabase did not return a created user.");
  }
  return data.user;
}

async function clearTenantData(tenantId) {
  const tables = [
    "caltrans_phases",
    "caltrans_invoices",
    "grants",
    "environmental_factors",
    "meetings",
    "records_requests",
    "documents",
    "sales_tax_programs",
    "community_inputs",
    "projects",
  ];
  for (const table of tables) {
    await supabase.from(table).delete().eq("tenant_id", tenantId);
  }
}

async function upsertProjects(tenantId, projects) {
  if (!projects?.length) {
    return new Map();
  }
  const payload = projects.map((project) => ({
    ...project,
    tenant_id: tenantId,
  }));
  const { data, error } = await supabase.from("projects").insert(payload).select("id,name");
  if (error) {
    throw new Error(`Failed inserting projects: ${error.message}`);
  }
  return new Map(data.map((row) => [row.name, row.id]));
}

async function insertRelated(table, tenantId, rows) {
  if (!rows?.length) return;
  const payload = rows.map((row) => ({
    ...row,
    tenant_id: tenantId,
  }));
  const { error } = await supabase.from(table).insert(payload);
  if (error) {
    throw new Error(`Failed inserting ${table}: ${error.message}`);
  }
}

async function seedTenant(seed, userId) {
  const { data: existing } = await supabase
    .from("tenants")
    .select("id")
    .eq("slug", seed.slug)
    .maybeSingle();
  let tenantId = existing?.id;
  if (!tenantId) {
    const { data, error } = await supabase
      .from("tenants")
      .insert({
        name: seed.name,
        slug: seed.slug,
        timezone: seed.timezone,
        branding: seed.branding ?? {},
        settings: seed.settings ?? {},
      })
      .select("id")
      .single();
    if (error) throw new Error(`Failed creating tenant ${seed.name}: ${error.message}`);
    tenantId = data.id;
  } else {
    await supabase
      .from("tenants")
      .update({ timezone: seed.timezone, branding: seed.branding ?? {} })
      .eq("id", tenantId);
  }

  await supabase.from("tenant_users").upsert({
    tenant_id: tenantId,
    user_id: userId,
    role: "admin",
    status: "active",
  });

  await clearTenantData(tenantId);

  const projectMap = await upsertProjects(tenantId, seed.projects);

  const mapProjectId = (name) => {
    if (!name) return null;
    const id = projectMap.get(name);
    if (!id) {
      console.warn(`Project ${name} not found when seeding related data.`);
    }
    return id ?? null;
  };

  await insertRelated(
    "caltrans_phases",
    tenantId,
    seed.caltransPhases?.map(({ project, ps_e_certified, ...rest }) => ({
      ...rest,
      ps_e_certified: typeof ps_e_certified === "boolean" ? ps_e_certified : false,
      project_id: mapProjectId(project),
    })),
  );
  await insertRelated(
    "grants",
    tenantId,
    seed.grants?.map(({ project, ...rest }) => ({ ...rest, project_id: mapProjectId(project) })),
  );
  await insertRelated(
    "community_inputs",
    tenantId,
    seed.communityInputs?.map(({ project, ...rest }) => ({
      ...rest,
      source: "public",
      project_id: mapProjectId(project),
    })),
  );
  await insertRelated(
    "meetings",
    tenantId,
    seed.meetings?.map(({ project, ...rest }) => ({ ...rest, project_id: mapProjectId(project) })),
  );
  await insertRelated(
    "records_requests",
    tenantId,
    seed.recordsRequests?.map(({ project, ...rest }) => ({ ...rest, project_id: mapProjectId(project) })),
  );
  await insertRelated(
    "environmental_factors",
    tenantId,
    seed.environmentalFactors?.map(({ project, ...rest }) => ({ ...rest, project_id: mapProjectId(project) })),
  );
  await insertRelated("sales_tax_programs", tenantId, seed.salesTaxPrograms);

  return tenantId;
}

async function main() {
  const user = await ensureDemoUserAccount();
  await supabase
    .from("profiles")
    .upsert({ id: user.id, full_name: demoUser.fullName, current_tenant: null });

  let defaultTenantId = null;
  for (const [index, seed] of tenantSeeds.entries()) {
    const tenantId = await seedTenant(seed, user.id);
    if (index === 0) {
      defaultTenantId = tenantId;
    }
  }

  if (defaultTenantId) {
    await supabase.from("profiles").update({ current_tenant: defaultTenantId }).eq("id", user.id);
  }

  console.log("Seeding complete. Demo credentials:");
  console.log(`Email: ${demoUser.email}`);
  console.log(`Password: ${demoUser.password}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
