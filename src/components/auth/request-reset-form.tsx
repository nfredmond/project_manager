"use client";

import { useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function RequestResetForm() {
  const supabase = getBrowserSupabaseClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/update-password`,
      });
      if (error) throw error;
      toast.success("Password reset link sent if the account exists.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="planner@agency.gov"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending link…" : "Send reset link"}
      </Button>
    </form>
  );
}
