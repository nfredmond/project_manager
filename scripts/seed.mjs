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
    ... (content truncated for brevity) ...