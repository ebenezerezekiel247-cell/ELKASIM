-- ============================================================
-- EL•KASIM LUXURY — initial schema
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- profiles (extends auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- products ----------
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(12, 2) not null check (price >= 0),
  category text not null,
  image_url text,
  cloudinary_public_id text,
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_featured_idx on public.products (featured);
create index if not exists products_created_at_idx on public.products (created_at desc);

-- ---------- addresses ----------
create table if not exists public.addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  country text not null default 'Nigeria',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- wishlist ----------
create table if not exists public.wishlist (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ---------- cart ----------
create table if not exists public.cart (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ---------- orders ----------
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  amount numeric(12, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'failed')),
  payment_reference text unique,
  shipping_address jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);

-- ---------- order_items ----------
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id),
  quantity integer not null check (quantity > 0),
  price numeric(12, 2) not null
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.addresses enable row level security;
alter table public.wishlist enable row level security;
alter table public.cart enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- profiles: user reads/updates own row; admins read all
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.is_admin
  ));

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- products: public read; admin write
create policy "products_public_read" on public.products
  for select using (true);

create policy "products_admin_write" on public.products
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- addresses: owner only
create policy "addresses_owner" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- wishlist: owner only
create policy "wishlist_owner" on public.wishlist
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- cart: owner only
create policy "cart_owner" on public.cart
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- orders: owner reads own, admin reads/updates all; inserts happen server-side (service role)
create policy "orders_owner_select" on public.orders
  for select using (
    auth.uid() = user_id or exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.is_admin
    )
  );

create policy "orders_admin_update" on public.orders
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- order_items: readable if the parent order is readable
create policy "order_items_owner_select" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or exists (
          select 1 from public.profiles p where p.id = auth.uid() and p.is_admin
        ))
    )
  );

-- ============================================================
-- Trigger: auto-create profile row on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Helper: decrement stock atomically (called from server action)
-- ============================================================
create or replace function public.decrement_stock(p_product_id uuid, p_quantity integer)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.products
  set stock = stock - p_quantity
  where id = p_product_id and stock >= p_quantity;

  if not found then
    raise exception 'Insufficient stock for product %', p_product_id;
  end if;
end;
$$;
