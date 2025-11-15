"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { dashboardRoutes } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

interface MobileNavProps {
  tenantName?: string;
}

export function MobileNav({ tenantName }: MobileNavProps) {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium md:hidden">
        <Menu className="mr-2 h-4 w-4" />
        Menu
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Tenant</p>
            <p className="text-base font-semibold">{tenantName ?? "Select tenant"}</p>
          </div>
          <ThemeToggle />
        </div>
        <nav className="flex flex-col gap-1">
          {dashboardRoutes.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

