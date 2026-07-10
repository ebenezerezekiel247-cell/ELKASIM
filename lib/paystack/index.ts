const PAYSTACK_BASE = "https://api.paystack.co";

type InitializeArgs = {
  email: string;
  amountKobo: number;
  reference: string;
  metadata?: Record<string, unknown>;
  callback_url?: string;
};

type InitializeResponse = {
  status: boolean;
  message: string;
  data: { authorization_url: string; access_code: string; reference: string };
};

type VerifyResponse = {
  status: boolean;
  message: string;
  data: {
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    currency: string;
    paid_at: string | null;
    metadata: Record<string, unknown>;
  };
};

/**
 * Initializes a Paystack transaction. Called server-side only — never expose
 * PAYSTACK_SECRET_KEY to the client.
 */
export async function initializeTransaction(args: InitializeArgs): Promise<InitializeResponse> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: args.email,
      amount: args.amountKobo,
      reference: args.reference,
      metadata: args.metadata,
      callback_url: args.callback_url,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Paystack initialize failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Verifies a transaction reference directly against Paystack's servers.
 * This is the source of truth — never trust amount/status sent from the client.
 */
export async function verifyTransaction(reference: string): Promise<VerifyResponse> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Paystack verify failed: ${res.status}`);
  }

  return res.json();
}

export function nairaToKobo(naira: number) {
  return Math.round(naira * 100);
}

export function koboToNaira(kobo: number) {
  return kobo / 100;
}
