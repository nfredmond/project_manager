import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { TopBar } from "@/components/layout/top-bar";
import { getActiveTenant, getProfile, getTenants } from "@/lib/data-access";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [profile, tenantUsers, activeTenant] = await Promise.all([getProfile(), getTenants(), getActiveTenant()]);

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar tenantName={activeTenant?.name} />
      <div className="flex flex-1 flex-col">
        <div className="border-b px-4 py-3 md:hidden">
          <MobileNav tenantName={activeTenant?.name} />
        </div>
        <TopBar
          userName={profile.full_name ?? user.email}
          userEmail={user.email}
          avatarUrl={profile.avatar_url}
          tenants={tenantUsers}
          activeTenant={activeTenant}
        />
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
