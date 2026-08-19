-- =============================================================================
-- Velora Shop — Storage
-- Public bucket for product images with admin-only upload policies.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Public read of product images
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Authenticated admins can upload product images
create policy "Admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and public.is_admin()
  );

-- Authenticated admins can update product images
create policy "Admins can update product images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and public.is_admin()
  );

-- Authenticated admins can delete product images
create policy "Admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and public.is_admin()
  );