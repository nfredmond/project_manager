export type TenantRole = "admin" | "manager" | "staff" | "viewer";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  timezone?: string | null;
  branding?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  created_at?: string;
}

export interface Profile {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  title?: string | null;
  phone?: string | null;
  current_tenant?: string | null;
  preferences?: Record<string, unknown>;
  created_at?: string;
}

export interface TenantUser {
  tenant_id: string;
  user_id: string;
  role: TenantRole;
  status: string;
  invited_by?: string | null;
  created_at?: string;
  tenants?: Tenant;
}

export type ProjectStatus = "draft" | "active" | "on_hold" | "completed" | "closed";

export interface Project {
  id: string;
  tenant_id: string;
  name: string;
  code?: string | null;
  client?: string | null;
  status: ProjectStatus;
  description?: string | null;
  lead_manager?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  ped?: string | null;
  budget: number;
  spent: number;
  funding?: Record<string, unknown>;
  tags?: string[] | null;
  location?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export type PhaseType = "PE" | "RW" | "RW_UTIL" | "CON" | "CE";
export type PhaseStatus = "planned" | "authorized" | "in_progress" | "submitted" | "closed";

export interface CaltransPhase {
  id: string;
  tenant_id: string;
  project_id: string;
  phase: PhaseType;
  status: PhaseStatus;
  e76_number?: string | null;
  authorization_date?: string | null;
  ped_due_date?: string | null;
  nepa_status?: string | null;
  ps_e_certified: boolean;
  federal_funds?: number | null;
  state_funds?: number | null;
  local_funds?: number | null;
  dbe_goal?: number | null;
  notes?: string | null;
  created_at?: string;
}

export type GrantStage = "prospecting" | "drafting" | "submitted" | "awarded" | "denied" | "reporting";

export interface Grant {
  id: string;
  tenant_id: string;
  project_id?: string | null;
  name: string;
  grant_type?: string | null;
  stage: GrantStage;
  funding_source?: string | null;
  deadline?: string | null;
  award_date?: string | null;
  requested_amount?: number | null;
  match_amount?: number | null;
  summary?: string | null;
  narrative?: Record<string, unknown> | null;
  reminders?: Record<string, unknown>[] | null;
  ai_context?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
  projects?: Pick<Project, "name" | "code"> | null;
}

export interface EnvironmentalFactor {
  id: string;
  tenant_id: string;
  project_id: string;
  factor: string;
  status: string;
  significance?: string | null;
  mitigation?: string | null;
  lead_agency?: string | null;
  doc_url?: string | null;
  due_date?: string | null;
  created_at?: string;
}

export type MeetingType = "board" | "council" | "community" | "internal" | "task_force";

export interface Meeting {
  id: string;
  tenant_id: string;
  project_id?: string | null;
  title: string;
  meeting_type: MeetingType;
  meeting_date?: string | null;
  location?: string | null;
  agenda?: Record<string, unknown>[] | null;
  minutes?: Record<string, unknown>[] | null;
  resolutions?: string | null;
  notes?: string | null;
  status?: string | null;
  recording_url?: string | null;
  created_at?: string;
}

export type RequestStatus = "open" | "in_progress" | "fulfilled" | "closed";

export interface RecordsRequest {
  id: string;
  tenant_id: string;
  project_id?: string | null;
  requester: string;
  contact?: string | null;
  topic?: string | null;
  received_on: string;
  due_on?: string | null;
  status: RequestStatus;
  fulfillment?: Record<string, unknown>;
  notes?: string | null;
  created_at?: string;
}

export type DocumentCategory =
  | "contract"
  | "invoice"
  | "environmental"
  | "grant"
  | "meeting"
  | "caltrans"
  | "other";

export interface Document {
  id: string;
  tenant_id: string;
  project_id?: string | null;
  title: string;
  category: DocumentCategory;
  storage_path: string;
  version: number;
  uploaded_by?: string | null;
  tags?: string[] | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface SalesTaxProgram {
  id: string;
  tenant_id: string;
  measure: string;
  revenue?: number | null;
  expenditures?: number | null;
  status: string;
  report?: Record<string, unknown>;
  created_at?: string;
}

export type CommunityStatus = "new" | "review" | "approved" | "archived";

export interface CommunityInput {
  id: string;
  tenant_id: string;
  project_id?: string | null;
  display_name?: string | null;
  email?: string | null;
  category: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  geojson?: Record<string, unknown> | null;
  photo_url?: string | null;
  status: CommunityStatus;
  source: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export type ActionItemType = "caltrans" | "grant" | "meeting" | "records";
export type ActionItemSeverity = "overdue" | "soon" | "normal";

export interface ActionItem {
  id: string;
  type: ActionItemType;
  title: string;
  description: string;
  dueDate?: string | null;
  href: string;
  severity: ActionItemSeverity;
}

export interface DashboardMetrics {
  projects: number;
  open_grants: number;
  community_inputs: number;
  total_budget: number;
  total_spent: number;
}

export interface RolePermissions {
  canEditProjects: boolean;
  canInviteMembers: boolean;
  canReviewCommunity: boolean;
}

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships?: never;
      };
    };
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
  };
};

