"use client";

import { useState } from "react";
import { requestPasswordReset, updatePassword } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function requestReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
      toast.success("Reset link sent — check your email");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function setPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePassword(newPassword);
      toast.success("Password updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-16">
      <h1 className="font-display text-2xl font-bold">Reset password</h1>

      {!sent ? (
        <form onSubmit={requestReset} className="flex flex-col gap-4">
          <p className="font-body text-sm text-steel">
            Enter your email and we'll send you a reset link.
          </p>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Button type="submit" size="lg" disabled={loading}>Send reset link</Button>
        </form>
      ) : (
        <form onSubmit={setPassword} className="flex flex-col gap-4">
          <p className="font-body text-sm text-steel">
            Followed the link from your email? Set your new password below.
          </p>
          <div>
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" type="password" className="mt-1.5" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" size="lg" disabled={loading}>Update password</Button>
        </form>
      )}
    </div>
  );
}
