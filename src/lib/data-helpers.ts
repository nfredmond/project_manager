import { differenceInCalendarDays } from "date-fns";
import type {
  ActionItem,
  CaltransPhase,
  Grant,
  Meeting,
  Project,
  RecordsRequest,
  RolePermissions,
  TenantRole,
} from "./types";

export function summarizeBudget(projects: Project[]) {
  return projects.reduce(
    (acc, project) => {
      acc.totalBudget += Number(project.budget ?? 0);
      acc.totalSpent += Number(project.spent ?? 0);
      return acc;
    },
    { totalBudget: 0, totalSpent: 0 },
  );
}

const PERMISSION_MATRIX: Record<TenantRole | "viewer", RolePermissions> = {
  admin: {
    canEditProjects: true,
    canInviteMembers: true,
    canReviewCommunity: true,
  },
  manager: {
    canEditProjects: true,
    canInviteMembers: true,
    canReviewCommunity: true,
  },
  staff: {
    canEditProjects: true,
    canInviteMembers: false,
    canReviewCommunity: true,
  },
  viewer: {
    canEditProjects: false,
    canInviteMembers: false,
    canReviewCommunity: false,
  },
};

export function deriveRolePermissions(role?: TenantRole | null): RolePermissions {
  return PERMISSION_MATRIX[role ?? "viewer"];
}

export const ACTION_TYPE_LABELS: Record<ActionItem["type"], string> = {
  caltrans: "Caltrans LAPM",
  grant: "Grant",
  meeting: "Meeting",
  records: "Public Records",
};

export const ACTION_SEVERITY_META: Record<ActionItem["severity"], { label: string; variant: "destructive" | "secondary" | "outline" }> = {
  overdue: { label: "Overdue", variant: "destructive" },
  soon: { label: "Due soon", variant: "secondary" },
  normal: { label: "Planned", variant: "outline" },
};

const DEFAULT_DESCRIPTION: Record<ActionItem["type"], string> = {
  caltrans: "Update LAPM packet and PED milestone.",
  grant: "Review deadline, match, and narrative readiness.",
  meeting: "Finalize agenda & publish materials.",
  records: "Respond to PRA before the statutory deadline.",
};

function determineSeverity(dueDate?: string | null) {
  if (!dueDate) return "normal";
  const parsed = new Date(dueDate);
  if (Number.isNaN(parsed.getTime())) return "normal";
  const days = differenceInCalendarDays(parsed, new Date());
  if (days < 0) return "overdue";
  if (days <= 14) return "soon";
  return "normal";
}

function resolveProjectName(projects: Project[], id?: string | null) {
  return projects.find((project) => project.id === id)?.name;
}

function sortActionItems(items: ActionItem[]) {
  const severityWeight: Record<ActionItem["severity"], number> = {
    overdue: 0,
    soon: 1,
    normal: 2,
  };
  return items.sort((a, b) => {
    if (severityWeight[a.severity] !== severityWeight[b.severity]) {
      return severityWeight[a.severity] - severityWeight[b.severity];
    }
    const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
    const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
    return aTime - bTime;
  });
}

interface BuildActionItemsArgs {
  projects: Project[];
  phases: CaltransPhase[];
  grants: Grant[];
  meetings: Meeting[];
  records: RecordsRequest[];
}

export function buildActionItems({ projects, phases, grants, meetings, records }: BuildActionItemsArgs) {
  const items: ActionItem[] = [];

  phases.forEach((phase) => {
    items.push({
      id: phase.id,
      type: "caltrans",
      title: `${resolveProjectName(projects, phase.project_id) ?? "Project"} · ${phase.phase}`,
      description: DEFAULT_DESCRIPTION.caltrans,
      dueDate: phase.ped_due_date ?? undefined,
      href: "/caltrans",
      severity: determineSeverity(phase.ped_due_date),
    });
  });

  grants.forEach((grant) => {
    items.push({
      id: grant.id,
      type: "grant",
      title: `${grant.name}`,
      description: grant.summary ?? DEFAULT_DESCRIPTION.grant,
      dueDate: grant.deadline ?? undefined,
      href: "/grants",
      severity: determineSeverity(grant.deadline),
    });
  });

  meetings.forEach((meeting) => {
    items.push({
      id: meeting.id,
      type: "meeting",
      title: `${meeting.title}`,
      description: meeting.location ?? DEFAULT_DESCRIPTION.meeting,
      dueDate: meeting.meeting_date ?? undefined,
      href: "/meetings",
      severity: determineSeverity(meeting.meeting_date),
    });
  });

  records.forEach((record) => {
    items.push({
      id: record.id,
      type: "records",
      title: record.requester,
      description: record.topic ?? DEFAULT_DESCRIPTION.records,
      dueDate: record.due_on ?? undefined,
      href: "/records-requests",
      severity: determineSeverity(record.due_on),
    });
  });

  return sortActionItems(items);
}

