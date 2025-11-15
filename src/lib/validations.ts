import { z } from "zod";

const tenantRoles = ["admin", "manager", "staff", "viewer"] as const;
const grantStages = ["prospecting", "drafting", "submitted", "awarded", "denied", "reporting"] as const;
const phaseTypes = ["PE", "RW", "RW_UTIL", "CON", "CE"] as const;
const phaseStatuses = ["planned", "authorized", "in_progress", "submitted", "closed"] as const;
const documentCategories = ["contract", "invoice", "environmental", "grant", "meeting", "caltrans", "other"] as const;
const projectStatuses = ["draft", "active", "on_hold", "completed", "closed"] as const;

const optionalString = z
  .preprocess((value) => {
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  }, z.string())
  .optional();

const nullableString = z
  .preprocess((value) => {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  }, z.string().nullable());

const nullableUuid = z.preprocess((value) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}, z.string().uuid().nullable());

const numericField = z
  .preprocess((value) => {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim().length > 0) {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }, z.number().nonnegative().optional());

const percentageField = z
  .preprocess((value) => {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim().length > 0) {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }, z.number().min(0).max(100).optional());

export const tenantRoleSchema = z.enum(tenantRoles);
export const grantStageSchema = z.enum(grantStages);

export const invitationSchema = z.object({
  email: z
    .preprocess((value) => (typeof value === "string" ? value.trim() : value), z.string().email("Valid email required")),
  role: tenantRoleSchema.default("viewer"),
});

export const projectStatusSchema = z.enum(projectStatuses);

export const grantSchema = z.object({
  name: z
    .preprocess((value) => (typeof value === "string" ? value.trim() : value), z.string().min(2, "Grant name is required")),
  project_id: nullableUuid,
  grant_type: optionalString,
  stage: grantStageSchema.default("prospecting"),
  funding_source: optionalString,
  deadline: optionalString,
  requested_amount: numericField,
  match_amount: numericField,
  summary: optionalString,
});

export const documentSchema = z.object({
  title: z
    .preprocess((value) => (typeof value === "string" ? value.trim() : value), z.string().min(2, "Title is required")),
  project_id: nullableUuid,
  category: z.enum(documentCategories),
});

export const phaseSchema = z.object({
  project_id: z
    .preprocess((value) => {
      if (typeof value !== "string" || value.trim().length === 0) return undefined;
      return value;
    }, z.string().uuid("Project is required")),
  phase: z.enum(phaseTypes),
  status: z.enum(phaseStatuses).default("planned"),
  e76_number: optionalString,
  authorization_date: optionalString,
  ped_due_date: optionalString,
  federal_funds: numericField,
  state_funds: numericField,
  local_funds: numericField,
  dbe_goal: percentageField,
  notes: nullableString,
});

export const projectSchema = z.object({
  name: z
    .preprocess((value) => (typeof value === "string" ? value.trim() : value), z.string().min(2, "Project name is required")),
  code: optionalString,
  status: projectStatusSchema.default("draft"),
  budget: numericField,
  spent: numericField,
  description: optionalString,
  client: optionalString,
});

