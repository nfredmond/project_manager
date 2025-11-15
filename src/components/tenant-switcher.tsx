"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Tenant, TenantUser } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { switchTenantAction } from "@/actions/tenant";
import { toast } from "sonner";

interface TenantSwitcherProps {
  tenants: TenantUser[];
  activeTenant?: Tenant | null;
}

export function TenantSwitcher({ tenants, activeTenant }: TenantSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentId = activeTenant?.id ?? "";

  const handleChange = (value: string) => {
    startTransition(async () => {
      try {
        await switchTenantAction(value);
        router.refresh();
        toast.success("Tenant switched");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to switch tenants";
        toast.error(message);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowLeftRight className="h-4 w-4" />
        Tenant
      </div>
      <Select defaultValue={currentId} onValueChange={handleChange} disabled={isPending}>
        <SelectTrigger>
          <SelectValue placeholder="Choose tenant" />
        </SelectTrigger>
        <SelectContent>
          {tenants.map((tenantUser) => (
            <SelectItem key={tenantUser.tenant_id} value={tenantUser.tenant_id}>
              {tenantUser.tenants?.name ?? tenantUser.tenant_id} · {tenantUser.role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

