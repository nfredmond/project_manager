"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardRoutes } from "@/lib/navigation";
import { cn, tenantAccent } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  tenantName?: string;
}

export function Sidebar({ tenantName }: SidebarProps) {
  const pathname = usePathname();
  const accent = tenantName ? tenantAccent(tenantName) : "#2563eb";

  return (
    <aside className="hidden border-r bg-muted/30 md:flex md:w-64 md:flex-col">
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground tracking-tight">Tenant</p>
          <p className="text-base font-semibold" style={{ color: accent }}>
            {tenantName ?? "Select tenant"}
          </p>
        </div>
        <ThemeToggle />
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 px-3 py-4">
          {dashboardRoutes.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}

