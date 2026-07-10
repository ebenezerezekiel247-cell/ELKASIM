"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, signUp, signInWithGoogle } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn({ email, password });
        toast.success("Welcome back");
      } else {
        await signUp({ email, password, fullName });
        toast.success("Check your email to confirm your account");
      }
      router.push(searchParams.get("redirect") ?? "/");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-16">
      <h1 className="font-display text-2xl font-bold">
        {mode === "login" ? "Sign in" : "Create an account"}
      </h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {mode === "register" && (
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" className="mt-1.5" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" className="mt-1.5" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          {mode === "login" && (
            <Link href="/reset-password" className="mt-1.5 inline-block font-mono text-xs text-steel hover:text-ink">
              Forgot password?
            </Link>
          )}
        </div>
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="font-mono text-[10px] uppercase text-steel">or</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <Button variant="outline" size="lg" onClick={() => signInWithGoogle()}>
        Continue with Google
      </Button>

      <p className="text-center font-mono text-xs text-steel">
        {mode === "login" ? (
          <>New here? <Link href="/register" className="text-ink underline">Create an account</Link></>
        ) : (
          <>Already have an account? <Link href="/login" className="text-ink underline">Sign in</Link></>
        )}
      </p>
    </div>
  );
}
