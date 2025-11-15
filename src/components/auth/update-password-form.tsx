"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const updateSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type UpdateValues = z.infer<typeof updateSchema>;

export function UpdatePasswordForm() {
  const supabase = getBrowserSupabaseClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: UpdateValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: values.password });
      if (error) throw error;
      toast.success("Password updated");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input id="password" type="password" {...form.register("password")} />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}

