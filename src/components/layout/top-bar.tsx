"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dashboardRoutes } from "@/lib/navigation";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Tenant, TenantUser } from "@/lib/types";
import { TenantSwitcher } from "@/components/tenant-switcher";

interface TopBarProps {
  userName?: string | null;
  userEmail?: string | null;
  avatarUrl?: string | null;
  tenants: TenantUser[];
  activeTenant?: Tenant | null;
}

export function TopBar({ userName, userEmail, avatarUrl, tenants, activeTenant }: TopBarProps) {
  const pathname = usePathname();
  const supabase = getBrowserSupabaseClient();

  const activePage = dashboardRoutes.find((route) => pathname?.startsWith(route.href));

  const breadcrumbs = activePage ? ["Dashboard", activePage.label] : ["Dashboard"];

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    window.location.href = "/login";
  };

  return (
    <header className="flex flex-col gap-4 border-b bg-background/60 px-4 py-3 backdrop-blur md:flex-row md:items-center md:justify-between md:px-8">
      <div>
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb} className="flex items-center gap-2">
              <span className={cn(index === breadcrumbs.length - 1 && "text-foreground font-medium")}>{crumb}</span>
              {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4" />}
            </div>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">Compliance-ready planning OS</p>
      </div>
      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-end">
        {tenants.length > 0 && (
          <>
            <div className="md:hidden">
              <TenantSwitcher tenants={tenants} activeTenant={activeTenant ?? null} />
            </div>
            <div className="hidden w-60 md:block">
              <TenantSwitcher tenants={tenants} activeTenant={activeTenant ?? null} />
            </div>
          </>
        )}
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full border px-2 py-1 text-left">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={userName ?? "User"} width={28} height={28} className="rounded-full" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
              )}
              <div className="hidden text-xs md:block">
                <p className="font-medium text-foreground">{userName ?? "User"}</p>
                <p className="text-muted-foreground">{userEmail}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-medium">{userName ?? "User"}</div>
              <div className="text-xs text-muted-foreground">{userEmail}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

