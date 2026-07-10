"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/actions/orders";
import type { OrderStatus } from "@/types";
import { toast } from "sonner";

const STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled", "failed"];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as OrderStatus;
    startTransition(async () => {
      await updateOrderStatus(orderId, next);
      toast.success(`Order marked ${next}`);
      router.refresh();
    });
  }

  return (
    <select
      defaultValue={status}
      onChange={handleChange}
      disabled={isPending}
      className="h-9 rounded-md border border-line bg-paper px-2 font-mono text-xs uppercase tracking-wide"
    >
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
