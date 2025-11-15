"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const signupSchema = z.object({
  tenantName: z.string().min(2, "Organization name is required"),
  tenantSlug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupValues = z.infer<typeof signupSchema>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 32);
}

export function SignupForm() {
  const router = useRouter();
  const supabase = getBrowserSupabaseClient();
  const [loading, setLoading] = useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      tenantName: "",
      tenantSlug: "",
      email: "",
      password: "",
    },
  });

  const tenantName = form.watch("tenantName");
  const slugDirty = form.formState.dirtyFields.tenantSlug;
  useEffect(() => {
    if (slugDirty) return;
    form.setValue("tenantSlug", slugify(tenantName ?? ""), { shouldDirty: false });
  }, [tenantName, slugDirty, form]);

  const onSubmit = async (values: SignupValues) => {
    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { tenant_name: values.tenantName },
        },
      });
      if (signUpError) throw signUpError;

      const { error: tenantError } = await supabase.rpc("create_tenant_with_owner", {
        p_name: values.tenantName,
        p_slug: values.tenantSlug,
      });
      if (tenantError) throw tenantError;

      toast.success("Workspace created. Check your email to confirm your account.");
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create workspace";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="tenantName">Agency or city name</Label>
        <Input id="tenantName" {...form.register("tenantName")} placeholder="City of --" />
        {form.formState.errors.tenantName && (
          <p className="text-sm text-destructive">{form.formState.errors.tenantName.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="tenantSlug">Tenant slug</Label>
        <Input id="tenantSlug" {...form.register("tenantSlug")} placeholder="city-transport" />
        {form.formState.errors.tenantSlug && (
          <p className="text-sm text-destructive">{form.formState.errors.tenantSlug.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Work email</Label>
        <Input id="email" type="email" {...form.register("email")} placeholder="planner@agency.gov" />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...form.register("password")} />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating workspace…" : "Create workspace"}
      </Button>
    </form>
  );
}

