-- =============================================================================
-- Velora Shop — Initial schema
-- Run this file in the Supabase SQL editor (or via `supabase db push`).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Extensions
-- -----------------------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- Order number sequence
-- -----------------------------------------------------------------------------
create sequence if not exists public.order_number_seq start 1000;

-- -----------------------------------------------------------------------------
-- updated_at trigger helper
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- Categories
-- =============================================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name_fr text not null,
  name_ar text not null,
  slug text not null unique,
  description_fr text,
  description_ar text,
  image_url text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_categories_active on public.categories (is_active);
create index if not exists idx_categories_order on public.categories (display_order);

-- =============================================================================
-- Products
-- =============================================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name_fr text not null,
  name_ar text not null,
  slug text not null unique,
  description_fr text not null default '',
  description_ar text not null default '',
  price numeric(12,2) not null check (price >= 0),
  sale_price numeric(12,2) check (sale_price >= 0),
  is_featured boolean not null default false,
  is_best_seller boolean not null default false,
  is_active boolean not null default true,
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on public.products (category_id);
create index if not exists idx_products_active on public.products (is_active);
create index if not exists idx_products_featured on public.products (is_featured, is_active);
create index if not exists idx_products_best_seller on public.products (is_best_seller, is_active);
create index if not exists idx_products_created on public.products (created_at desc);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- =============================================================================
-- Product images
-- =============================================================================
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt_text text,
  display_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_images_product on public.product_images (product_id);
create index if not exists idx_product_images_primary on public.product_images (product_id, is_primary);

-- =============================================================================
-- Product variants
-- =============================================================================
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text unique,
  name_fr text not null,
  name_ar text not null,
  options jsonb not null default '{}'::jsonb,
  price_override numeric(12,2) check (price_override >= 0),
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_product_variants_product on public.product_variants (product_id);

-- =============================================================================
-- Wilayas (58 Algerian wilayas)
-- =============================================================================
create table if not exists public.wilayas (
  id integer primary key check (id between 1 and 58),
  code text not null unique,
  name_fr text not null,
  name_ar text not null,
  is_active boolean not null default true
);

create index if not exists idx_wilayas_active on public.wilayas (is_active);

-- =============================================================================
-- Delivery rates (one per wilaya)
-- =============================================================================
create table if not exists public.delivery_rates (
  id uuid primary key default gen_random_uuid(),
  wilaya_id integer not null unique references public.wilayas(id) on delete cascade,
  home_fee numeric(12,2) not null default 600 check (home_fee >= 0),
  stop_desk_fee numeric(12,2) not null default 400 check (stop_desk_fee >= 0),
  estimated_days_min integer not null default 2 check (estimated_days_min >= 1),
  estimated_days_max integer not null default 4 check (estimated_days_max >= estimated_days_min),
  is_active boolean not null default true
);

create index if not exists idx_delivery_rates_active on public.delivery_rates (is_active);

-- =============================================================================
-- Orders
-- =============================================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default (
    'VEL-' || lpad(nextval('public.order_number_seq')::text, 5, '0')
  ),
  customer_name text not null,
  customer_phone text not null,
  wilaya_id integer not null references public.wilayas(id),
  commune text not null,
  shipping_address text not null,
  delivery_type text not null default 'home'
    check (delivery_type in ('home', 'stop_desk')),
  notes text,
  subtotal numeric(12,2) not null check (subtotal >= 0),
  delivery_fee numeric(12,2) not null check (delivery_fee >= 0),
  total_amount numeric(12,2) not null check (total_amount >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_created on public.orders (created_at desc);
create index if not exists idx_orders_phone on public.orders (customer_phone);
create index if not exists idx_orders_number on public.orders (order_number);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- =============================================================================
-- Order items
-- =============================================================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_name text,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  total_price numeric(12,2) not null check (total_price >= 0)
);

create index if not exists idx_order_items_order on public.order_items (order_id);
create index if not exists idx_order_items_product on public.order_items (product_id);

-- =============================================================================
-- Customers (derived from order history, upserted at order creation)
-- =============================================================================
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  full_name text not null,
  wilaya_id integer references public.wilayas(id),
  total_orders integer not null default 1 check (total_orders >= 0),
  total_spent numeric(12,2) not null default 0 check (total_spent >= 0),
  last_order_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_customers_phone on public.customers (phone);

-- =============================================================================
-- Admin users (maps Supabase Auth users to the admin role)
-- =============================================================================
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.wilayas enable row level security;
alter table public.delivery_rates enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.customers enable row level security;
alter table public.admin_users enable row level security;

-- Helper: an authenticated user is an admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users au where au.id = auth.uid()
  );
$$;

-- Categories: public read of active, admin full access
create policy "Categories are publicly readable when active"
  on public.categories for select
  using (is_active = true);

create policy "Admins can manage categories"
  on public.categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Products: public read of active, admin full access
create policy "Products are publicly readable when active"
  on public.products for select
  using (is_active = true);

create policy "Admins can manage products"
  on public.products for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Product images: public read (only for active products), admin full access
create policy "Product images are publicly readable"
  on public.product_images for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id and p.is_active = true
    )
  );

create policy "Admins can manage product images"
  on public.product_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Product variants: public read (only for active products), admin full access
create policy "Product variants are publicly readable"
  on public.product_variants for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_variants.product_id and p.is_active = true
    )
  );

create policy "Admins can manage product variants"
  on public.product_variants for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Wilayas: public read of active, admin full access
create policy "Wilayas are publicly readable when active"
  on public.wilayas for select
  using (is_active = true);

create policy "Admins can manage wilayas"
  on public.wilayas for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Delivery rates: public read of active, admin full access
create policy "Delivery rates are publicly readable when active"
  on public.delivery_rates for select
  using (is_active = true);

create policy "Admins can manage delivery rates"
  on public.delivery_rates for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Orders: admin only (public customers place orders via server-side
-- service role client, never directly through the anon client).
create policy "Admins can manage orders"
  on public.orders for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage order items"
  on public.order_items for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can manage customers"
  on public.customers for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admin users: readable by any authenticated admin (for session checks)
create policy "Admins can read admin users"
  on public.admin_users for select
  to authenticated
  using (public.is_admin());

create policy "Only admins can grant admin access"
  on public.admin_users for insert
  to authenticated
  with check (public.is_admin());