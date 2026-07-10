"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    toast("You're on the list.");
    setEmail("");
  }

  return (
    <section className="border-t border-line bg-bone/60">
      <div className="container flex flex-col items-center gap-6 py-16 text-center md:py-24">
        <h2 className="font-display text-2xl font-bold md:text-3xl">Join the world</h2>
        <p className="max-w-sm font-body text-sm text-steel">
          Early access to drops, restocks, and the occasional archive piece.
        </p>
        <form onSubmit={subscribe} className="flex w-full max-w-sm gap-2">
          <Input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit">Join</Button>
        </form>
      </div>
    </section>
  );
}
