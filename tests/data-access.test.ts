import { describe, expect, it } from "vitest";
import { summarizeBudget, deriveRolePermissions } from "@/lib/data-helpers";
import type { Project } from "@/lib/types";

const makeProject = (overrides: Partial<Project>): Project => ({
  id: "project-id",
  tenant_id: "tenant-id",
  name: "Project",
  status: "active",
  budget: 0,
  spent: 0,
  ...overrides,
});

const mockProjects: Project[] = [
  makeProject({ id: "1", name: "A", budget: 1_000_000, spent: 250_000 }),
  makeProject({ id: "2", name: "B", budget: 500_000, spent: 100_000 }),
];

describe("summarizeBudget", () => {
  it("aggregates totals", () => {
    const summary = summarizeBudget(mockProjects);
    expect(summary.totalBudget).toBe(1_500_000);
    expect(summary.totalSpent).toBe(350_000);
  });
});

describe("deriveRolePermissions", () => {
  it("grants admin rights", () => {
    const perms = deriveRolePermissions("admin");
    expect(perms.canInviteMembers).toBe(true);
  });

  it("defaults to viewer", () => {
    const perms = deriveRolePermissions(null);
    expect(perms.canEditProjects).toBe(false);
  });
});
