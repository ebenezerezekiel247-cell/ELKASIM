"use client";

import { useState, useTransition } from "react";
import { addAddress, deleteAddress } from "@/actions/addresses";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Address } from "@/types";
import { toast } from "sonner";

export function AddressManager({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleAdd(formData: FormData) {
    const input = {
      full_name: String(formData.get("full_name")),
      phone: String(formData.get("phone")),
      line1: String(formData.get("line1")),
      city: String(formData.get("city")),
      state: String(formData.get("state")),
    };
    startTransition(async () => {
      await addAddress(input);
      toast.success("Address added");
      setShowForm(false);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {addresses.map((a) => (
        <div key={a.id} className="flex items-start justify-between rounded-card border border-line p-4">
          <div>
            <p className="font-display text-sm font-semibold">{a.full_name}</p>
            <p className="font-mono text-xs text-steel">{a.line1}, {a.city}, {a.state}</p>
            <p className="font-mono text-xs text-steel">{a.phone}</p>
          </div>
          <button onClick={() => handleDelete(a.id)} aria-label="Delete address">
            <Trash2 className="h-4 w-4 text-steel" />
          </button>
        </div>
      ))}

      {showForm ? (
        <form action={handleAdd} className="flex flex-col gap-3 rounded-card border border-line p-4">
          <Input name="full_name" placeholder="Full name" required />
          <Input name="phone" placeholder="Phone number" required />
          <Input name="line1" placeholder="Address" required />
          <div className="grid grid-cols-2 gap-3">
            <Input name="city" placeholder="City" required />
            <Input name="state" placeholder="State" required />
          </div>
          <Button type="submit" disabled={isPending}>Save address</Button>
        </form>
      ) : (
        <Button variant="outline" onClick={() => setShowForm(true)}>Add new address</Button>
      )}
    </div>
  );
}
