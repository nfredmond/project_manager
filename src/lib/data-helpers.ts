import type { Project, RolePermissions, TenantRole } from "./types";

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

