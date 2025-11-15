import { describe, expect, it } from "vitest";
import { summarizeBudget, deriveRolePermissions, buildActionItems } from "@/lib/data-helpers";
import type { CaltransPhase, Grant, Meeting, Project, RecordsRequest } from "@/lib/types";

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

const iso = (daysFromToday: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString();
};

const mockPhase: CaltransPhase = {
  id: "phase-1",
  tenant_id: "tenant-id",
  project_id: "1",
  phase: "PE",
  status: "in_progress",
  e76_number: "E76-1",
  authorization_date: iso(-30),
  ped_due_date: iso(10),
  nepa_status: null,
  ps_e_certified: false,
};

const mockGrant: Grant = {
  id: "grant-1",
  tenant_id: "tenant-id",
  name: "FTA Low-No",
  stage: "drafting",
  requested_amount: 5_000_000,
  summary: "Fleet electrification",
  deadline: iso(25),
  project_id: "1",
};

const mockMeeting: Meeting = {
  id: "meeting-1",
  tenant_id: "tenant-id",
  title: "Board workshop",
  meeting_type: "board",
  meeting_date: iso(3),
  status: "scheduled",
};

const mockRecord: RecordsRequest = {
  id: "record-1",
  tenant_id: "tenant-id",
  requester: "Transit Watch",
  received_on: iso(-5),
  due_on: iso(-1),
  status: "open",
  topic: "EIR model",
};

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

describe("buildActionItems", () => {
  it("prioritizes overdue requests", () => {
    const items = buildActionItems({
      projects: mockProjects,
      phases: [mockPhase],
      grants: [mockGrant],
      meetings: [mockMeeting],
      records: [mockRecord],
    });
    expect(items[0]).toMatchObject({ id: "record-1", severity: "overdue" });
    const types = items.map((item) => item.type);
    expect(types).toContain("caltrans");
    expect(types).toContain("meeting");
  });
});
