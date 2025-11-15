import { getServerSupabaseClient } from "./supabase/server";
import type {
  CaltransPhase,
  CommunityInput,
  DashboardMetrics,
  Document,
  EnvironmentalFactor,
  Grant,
  Meeting,
  Profile,
  Project,
  RecordsRequest,
  SalesTaxProgram,
  Tenant,
  TenantUser,
} from "./types";
import { summarizeBudget } from "./data-helpers";

export const getProfile = async () => {
  const supabase = getServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error) {
    console.error("profile error", error);
    return null;
  }
  return data as Profile;
};

export const getTenants = async () => {
  const supabase = getServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("tenants auth error", authError);
    return [] as TenantUser[];
  }

  const { data: memberships, error: membershipsError } = await supabase
    .from("tenant_users")
    .select("tenant_id, user_id, role, status, invited_by, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (membershipsError || !memberships?.length) {
    if (membershipsError) console.error("tenants memberships error", membershipsError);
    return [] as TenantUser[];
  }

  const { data: tenantRows, error: tenantsError } = await supabase
    .from("tenants")
    .select("*")
    .in(
      "id",
      memberships.map((membership) => membership.tenant_id),
    );

  if (tenantsError) {
    console.error("tenants lookup error", tenantsError);
  }

  const tenantMap = new Map((tenantRows ?? []).map((tenant) => [tenant.id, tenant as Tenant]));

  return memberships.map(
    (membership) =>
      ({
        ...membership,
        tenants: tenantMap.get(membership.tenant_id) ?? null,
      }) as TenantUser,
  );
};

export const getActiveTenant = async (): Promise<Tenant | null> => {
  const supabase = getServerSupabaseClient();
  const profile = await getProfile();
  const tenantUsers = await getTenants();

  if (profile?.current_tenant) {
    const existingTenant = tenantUsers.find((entry) => entry.tenant_id === profile.current_tenant)?.tenants;
    if (existingTenant) {
      return existingTenant as Tenant;
    }
  }

  const fallbackTenant = tenantUsers[0]?.tenants ?? null;

  if (fallbackTenant && profile && profile.current_tenant !== fallbackTenant.id) {
    await supabase.from("profiles").update({ current_tenant: fallbackTenant.id }).eq("id", profile.id);
  }

  return fallbackTenant ?? null;
};

export const getActiveMembership = async () => {
  const tenant = await getActiveTenant();
  if (!tenant) return null;
  const supabase = getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("tenant_users")
    .select("role")
    .eq("tenant_id", tenant.id)
    .eq("user_id", user.id)
    .maybeSingle();
  return data;
};

export const getProjects = async (): Promise<Project[]> => {
  const tenant = await getActiveTenant();
  if (!tenant) return [];
  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data as Project[];
};

export const getGrants = async (): Promise<Grant[]> => {
  const tenant = await getActiveTenant();
  if (!tenant) return [];
  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase
    .from("grants")
    .select("*, projects(name, code)")
    .eq("tenant_id", tenant.id)
    .order("deadline", { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return data as Grant[];
};

export const getCaltransPhases = async (): Promise<CaltransPhase[]> => {
  const tenant = await getActiveTenant();
  if (!tenant) return [];
  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase
    .from("caltrans_phases")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data as CaltransPhase[];
};

export const getCaltransInvoices = async () => {
  const tenant = await getActiveTenant();
  if (!tenant) return [];
  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase
    .from("caltrans_invoices")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("submitted_on", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data ?? [];
};

export const getMeetings = async (): Promise<Meeting[]> => {
  const tenant = await getActiveTenant();
  if (!tenant) return [];
  const supabase = getServerSupabaseClient();
  const { data } = await supabase
    .from("meetings")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("meeting_date", { ascending: true });
  return (data as Meeting[]) ?? [];
};

export const getRecordsRequests = async (): Promise<RecordsRequest[]> => {
  const tenant = await getActiveTenant();
  if (!tenant) return [];
  const supabase = getServerSupabaseClient();
  const { data } = await supabase
    .from("records_requests")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("received_on", { ascending: false });
  return (data as RecordsRequest[]) ?? [];
};

export const getDocuments = async (): Promise<Document[]> => {
  const tenant = await getActiveTenant();
  if (!tenant) return [];
  const supabase = getServerSupabaseClient();
  const { data } = await supabase
    .from("documents")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });
  return (data as Document[]) ?? [];
};

export const getSalesTaxPrograms = async () => {
  const tenant = await getActiveTenant();
  if (!tenant) return [] as SalesTaxProgram[];
  const supabase = getServerSupabaseClient();
  const { data } = await supabase
    .from("sales_tax_programs")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });
  return (data as SalesTaxProgram[]) ?? [];
};

export const getCommunityInputs = async (): Promise<CommunityInput[]> => {
  const tenant = await getActiveTenant();
  if (!tenant) return [];
  const supabase = getServerSupabaseClient();
  const { data } = await supabase
    .from("community_inputs")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });
  return (data as CommunityInput[]) ?? [];
};

export const getEnvironmentalFactors = async (): Promise<EnvironmentalFactor[]> => {
  const tenant = await getActiveTenant();
  if (!tenant) return [];
  const supabase = getServerSupabaseClient();
  const { data } = await supabase
    .from("environmental_factors")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });
  return (data as EnvironmentalFactor[]) ?? [];
};
export const getDashboardMetrics = async (): Promise<DashboardMetrics | null> => {
  const tenant = await getActiveTenant();
  if (!tenant) return null;
  const [projects, grants, inputs] = await Promise.all([getProjects(), getGrants(), getCommunityInputs()]);
  const summary = summarizeBudget(projects);
  return {
    projects: projects.length,
    open_grants: grants.filter((grant) => grant.stage !== "awarded" && grant.stage !== "denied").length,
    community_inputs: inputs.filter((input) => input.status !== "archived").length,
    total_budget: summary.totalBudget,
    total_spent: summary.totalSpent,
  };
};
