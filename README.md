# EL•KASIM LUXURY — Global Fashion World

A minimal, monochrome luxury streetwear storefront built with Next.js 15 (App
Router), Supabase, Cloudinary, and Paystack.

This repo is a strong, working foundation — the full shopping flow (browse →
cart → checkout → Paystack payment → verified order) and a real admin
dashboard are wired end to end. Treat it as v1: solid enough to build on, not
yet exhaustive (see **What's next** at the bottom).

---

## Stack

Next.js 15 · TypeScript · Tailwind CSS · Framer Motion · Supabase (DB + Auth) ·
Cloudinary · Paystack · Zustand · TanStack Query · React Hook Form · Zod

## 1. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/migrations/0001_init.sql` — this creates
   every table, enables Row Level Security, and adds the policies and
   triggers (auto-creating a `profiles` row on signup, atomic stock
   decrement).
3. Optionally run `supabase/migrations/0002_seed.sql` for six demo products
   so the storefront isn't empty on first run.
4. **Make yourself an admin**: sign up once through the app, then in the SQL
   editor run:
   ```sql
   update public.profiles set is_admin = true where id =
     (select id from auth.users where email = 'you@email.com');
   ```
5. Under **Authentication → Providers**, enable Email and (optionally)
   Google. Under **Authentication → URL Configuration**, set your site URL
   and add `/auth/callback` as a redirect URL.
6. Copy your Project URL, anon key, and service role key into `.env.local`
   (see `.env.example`).

## 2. Cloudinary setup

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. Copy your Cloud Name, API Key, and API Secret into `.env.local`.
3. Nothing else to configure — uploads go straight from the admin dashboard
   to Cloudinary via a signed, server-issued signature (`/api/cloudinary/sign`),
   so the API secret never reaches the browser. Deleting a product from
   `/admin/products` deletes its Cloudinary asset too.

## 3. Paystack setup

1. Create an account at [paystack.com](https://paystack.com) and grab your
   **test** keys first (Settings → API Keys & Webhooks).
2. Put the secret key in `PAYSTACK_SECRET_KEY` and the public key in
   `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`.
3. Once deployed, add your webhook URL in the Paystack dashboard:
   `https://yourdomain.com/api/paystack/webhook`. This is what finalizes an
   order if the customer closes the tab before returning from checkout —
   the same logic also runs when they do return, via `/api/paystack/verify`,
   so payments are confirmed either way. Amounts are always recomputed
   server-side from live product prices; the frontend is never trusted.

## 4. Local development

```bash
npm install
cp .env.example .env.local   # fill in the values above
npm run dev
```

Visit `http://localhost:3000`. Sign up, mark yourself admin (step 1.4
above), then visit `/admin/products` to add your first real product.

## 5. Deploying to Vercel

1. Push this repo to GitHub.
2. Import it into [Vercel](https://vercel.com/new).
3. Add every variable from `.env.example` in Project Settings → Environment
   Variables, with `NEXT_PUBLIC_SITE_URL` set to your production domain.
4. Deploy. Then add the production webhook URL in Paystack as described
   above, and add your production domain to Supabase's redirect URLs.
5. Switch Paystack to live keys once you're ready to accept real payments.

## Project structure

```
app/            routes (App Router) — (shop), (auth), account, admin, api
components/     ui primitives, shop, cart, admin, layout components
actions/        server actions — products, cart, wishlist, orders, addresses, auth
lib/            supabase (client/server/admin), paystack, cloudinary, utils
hooks/          zustand stores (cart, wishlist)
types/          shared TypeScript types
supabase/       SQL migrations + seed data
```

## What's next

This build covers the core commerce loop end to end. A few things worth
adding before a full public launch:

- **Product editing**: creation and deletion are wired; an edit form for
  existing products (reusing `components/admin/product-form.tsx`) is the
  natural next step.
- **Multiple product images**: schema currently stores one image per
  product, per the brief — extend `products` with a join table if you want
  a gallery per item.
- **Email receipts**: order confirmation emails aren't sent yet (Supabase
  can trigger these via a database webhook + Resend/Postmark).
- **Automated tests**: none included yet — start with the Paystack verify
  route and stock-decrement RPC, since those guard real money and inventory.

---

Brand: **EL•KASIM LUXURY** (ELKA WURLD) · elkasimluxury@gmail.com ·
+234 706 445 7337
