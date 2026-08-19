-- =============================================================================
-- Velora Shop — Service role grants
-- Tables created via `supabase db push` miss the default table privileges that
-- Supabase normally grants to the `service_role` role. Without these, direct
-- service-role table access fails with "permission denied for table ...".
-- RLS is bypassed by service_role (BYPASSRLS), so these grants are safe.
-- =============================================================================

grant select, insert, update, delete on table public.categories to service_role;
grant select, insert, update, delete on table public.products to service_role;
grant select, insert, update, delete on table public.product_images to service_role;
grant select, insert, update, delete on table public.product_variants to service_role;
grant select, insert, update, delete on table public.wilayas to service_role;
grant select, insert, update, delete on table public.delivery_rates to service_role;
grant select, insert, update, delete on table public.orders to service_role;
grant select, insert, update, delete on table public.order_items to service_role;
grant select, insert, update, delete on table public.customers to service_role;
grant select, insert, update, delete on table public.admin_users to service_role;