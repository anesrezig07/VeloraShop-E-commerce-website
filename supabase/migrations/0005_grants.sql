-- =============================================================================
-- Velora Shop — Grants
-- Tables created via `supabase db push` run under a different role than the
-- dashboard, so Supabase's default privileges do not apply automatically.
-- This restores the standard grants for the storefront (anon) and admin
-- (authenticated) roles. RLS still enforces all access rules.
-- =============================================================================

grant usage on schema public to anon, authenticated, service_role;

grant select on table public.categories to anon;
grant select on table public.products to anon;
grant select on table public.product_images to anon;
grant select on table public.product_variants to anon;
grant select on table public.wilayas to anon;
grant select on table public.delivery_rates to anon;

grant all on table public.categories to authenticated;
grant all on table public.products to authenticated;
grant all on table public.product_images to authenticated;
grant all on table public.product_variants to authenticated;
grant all on table public.wilayas to authenticated;
grant all on table public.delivery_rates to authenticated;
grant all on table public.orders to authenticated;
grant all on table public.order_items to authenticated;
grant all on table public.customers to authenticated;
grant all on table public.admin_users to authenticated;

grant all on all sequences in schema public to authenticated;
grant all on all functions in schema public to anon, authenticated, service_role;