import type { LucideIcon } from "lucide-react";
import {
  Gauge,
  FolderKanban,
  BadgeDollarSign,
  Sparkles,
  Leaf,
  Archive,
  CalendarClock,
  FileText,
  Users,
  Banknote,
  BarChart2,
  Settings,
  Target,
} from "lucide-react";

export interface DashboardRoute {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const dashboardRoutes: DashboardRoute[] = [
  { label: "Overview", href: "/dashboard", icon: Gauge },
  { label: "Action Center", href: "/action-center", icon: Target },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Caltrans", href: "/caltrans", icon: BadgeDollarSign },
  { label: "Grants", href: "/grants", icon: Sparkles },
  { label: "Environmental", href: "/environmental", icon: Leaf },
  { label: "Documents", href: "/documents", icon: Archive },
  { label: "Meetings", href: "/meetings", icon: CalendarClock },
  { label: "Records", href: "/records-requests", icon: FileText },
  { label: "Community", href: "/community", icon: Users },
  { label: "Sales Tax", href: "/sales-tax", icon: Banknote },
  { label: "Reports", href: "/reports", icon: BarChart2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

