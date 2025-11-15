import { getActiveTenant, getProfile } from "@/lib/data-access";
import { updateProfileAction, updateTenantSettingsAction } from "@/actions/settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { InviteMembersCard } from "@/components/settings/invite-members-card";

export default async function SettingsPage() {
  const [tenant, profile] = await Promise.all([getActiveTenant(), getProfile()]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Workspace</p>
        <h1 className="text-3xl font-semibold">Settings & onboarding</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tenant branding</CardTitle>
            <CardDescription>Update name, timezone, and default dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateTenantSettingsAction} className="space-y-3">
              <div>
                <Label>Workspace name</Label>
                <Input name="name" defaultValue={tenant?.name ?? ""} required />
              </div>
              <div>
                <Label>Timezone</Label>
                <Input name="timezone" defaultValue={tenant?.timezone ?? "America/Los_Angeles"} />
              </div>
              <div>
                <Label>Accent color</Label>
                <Input type="color" name="accent" defaultValue="#2563eb" className="h-10 w-16 p-0" />
              </div>
              <div>
                <Label>Default dashboard</Label>
                <Input name="default_dashboard" placeholder="/dashboard" defaultValue="/dashboard" />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label>Enable public portal</Label>
                  <p className="text-xs text-muted-foreground">Allow /community/[slug] submissions.</p>
                </div>
                <Switch name="enable_public_portal" defaultChecked />
              </div>
              <div>
                <Label>Logo URL</Label>
                <Input name="logo_url" placeholder="https://example.com/logo.png" />
              </div>
              <Button type="submit" className="w-full">
                Save workspace
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your profile</CardTitle>
            <CardDescription>Update display name and contact information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateProfileAction} className="space-y-3">
              <div>
                <Label>Full name</Label>
                <Input name="full_name" defaultValue={profile?.full_name ?? ""} required />
              </div>
              <div>
                <Label>Title</Label>
                <Input name="title" defaultValue={profile?.title ?? ""} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input name="phone" defaultValue={profile?.phone ?? ""} />
              </div>
              <Button type="submit" className="w-full">
                Save profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <InviteMembersCard />
    </div>
  );
}
