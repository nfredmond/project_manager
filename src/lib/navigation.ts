import type { LucideIcon } from "lucide-react";
import { Gauge, FolderKanban } from "lucide-react";

export interface DashboardRoute {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const dashboardRoutes: DashboardRoute[] = [
  { label: "Overview", href: "/dashboard", icon: Gauge },
  { label: "Projects", href: "/projects", icon: FolderKanban },
];

