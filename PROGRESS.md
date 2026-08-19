# Velora Shop — Progress

Production-grade COD-only e-commerce platform for Algeria.
**Stack:** Next.js 16.3.1 (App Router + Turbopack) · TypeScript · Tailwind CSS v4 · shadcn/ui base-nova (Base UI) · Supabase (Postgres + Auth + Storage) · Zod v4 · i18n (fr/ar, RTL).

---

## Completed

### Phase 1 — Scaffolding & Foundations
- Next.js App Router project, TypeScript, Tailwind v4, shadcn/ui base-nova (Base UI) components.
- Supabase client setup: `src/lib/supabase/{config,server,admin}.ts`, typed `database.types.ts` from migrations.
- i18n runtime (`src/lib/i18n`) + typed dictionaries (`src/i18n/dictionaries/fr.ts`, `ar.ts` with `Dictionary = typeof fr`), FR/AR routes under `/[locale]`, RTL layout for `ar`, static `generateStaticParams`.
- `src/proxy.ts` (async): locale negotiation/redirect **and** Supabase auth session refresh.
- `src/lib/{types,constants,format,validators,pricing,coerce}.ts`: domain types, order statuses/transitions, DA number/price/date formatting, zod schemas, price helpers.
- `src/components/ui/*`: shadcn base-nova components (button, card, input, select, dialog, alert-dialog, switch, table, sheet, tabs, textarea, label, skeleton, badge, sonner toast).

### Phase 2 — Database Schema (Supabase)
- Migrations `supabase/migrations/0001_initial_schema.sql` … `0004_order_creation.sql`:
  - Tables: `products`, `product_variants`, `product_images`, `categories`, `wilayas` (58), `delivery_rates`, `customers`, `orders`, `order_items`, `admin_users`.
  - RLS: storefront reads only `is_active` data; admin tables gated by `public.is_admin()`; guest order placement via `place_order(...)` PL/pgSQL RPC (service-role only, atomic, recomputes prices, checks/decrements stock, computes delivery fee from `delivery_rates`, returns order number/totals).
  - Seed data + storage bucket for product images.
- **NOT yet applied** to the live Supabase project.

### Phase 3 — Storefront (verified: build, tsc, lint, smoke)
- Data layer: `src/lib/data/{products,categories,delivery}.ts` (catalog w/ query/category/sort/maxPrice/pagination; featured/new/best-sellers; product by slug; related; delivery options/rate).
- Cart store `src/lib/cart/store.tsx`: `useSyncExternalStore`, localStorage `velora_cart`, add/update/remove/clear, hydration-safe.
- Components: header, footer, mobile-nav (Sheet), language-switcher, search-bar, cart-button, product-card, product-image, product-grid, add-to-cart-button (toast), price, section-header, hero, why-shop-section, category-grid, cod-banner, product-gallery, buy-box; `catalog/` sort/categories/max-price filters + pagination + mobile filters.
- Pages in `src/app/[locale]/(shop)/`: layout, homepage, `products`, `products/[slug]` (gallery, buy box, delivery/COD boxes, related, JSON-LD), `categories`, `categories/[slug]`. `next.config.ts` remote image patterns.

### Phase 4 — Cart & Checkout (verified)
- `0004_order_creation.sql` RPC `place_order` + typed `Functions.place_order`.
- `src/lib/actions/orders.ts`: `createOrder` server action (zod-validated → RPC).
- Pages: `cart` (+`cart-content`), `checkout` (+`checkout-form`: wilaya select, home/stop-desk cards with live fee/ETA, COD notice), `checkout/success` (order number, total, ETA).
- Smoke-tested: empty cart, checkout "indisponible" when not configured, success page.

### Phase 5 — Admin Dashboard (verified: tsc, lint, build, smoke)
- Auth: `src/lib/admin/session.ts` (`getAdminSession`/`requireAdmin`), `src/lib/actions/admin-auth.ts` (`adminSignIn`/`adminSignOut`), admin login page `(admin-auth)/admin/login`.
- Data: `src/lib/data/admin.ts` (dashboard stats, products, product, categories, orders w/ status filter, order detail, customers w/ wilaya, delivery rates).
- Actions: `src/lib/actions/admin.ts` (create/update/delete product incl. variants+images, toggle active, category CRUD, `updateOrderStatus`, `updateDeliveryRate`, `uploadProductImage`).
- UI: login-form, logout-button, sidebar-nav, status-badge, page-header, product-row-actions, products-table, product-form (large client form), categories-manager, order-status-actions, delivery-manager.
- Pages: dashboard, products list/new/edit, categories, orders list (status tabs) + order detail, customers, delivery (58-wilaya rate editor).
- Smoke-tested: `/fr/admin/login` renders form; protected `/admin/*` 307 → `/fr/admin/login` (locale-prefixed).
- Dictionary extended with ~45 admin keys (fr + ar).

---

## Verification status
- `npx tsc --noEmit` ✅ clean · `npm run lint` ✅ clean · `npm run build` ✅ passes (storefront SSG/static, admin mostly SSG, orders/order-detail/products dynamic) · smoke tests ✅.

## Current blocker
- **Supabase credentials are populated but the project URL does not resolve** — DNS lookup for the host in `NEXT_PUBLIC_SUPABASE_URL` (`jmqpmzkovhmkyucalvrc.supabase.co`) returns nothing (`ENOTFOUND`), while `google.com` and `supabase.co` resolve fine. Likely a typo in the project reference ID.
  - **Fix:** Supabase Dashboard → Project Settings → API → copy exact **Project URL**, **anon key**, **service_role key** into `.env.local`. Confirm all three.
- Once reachable, still need to: apply migrations 0001–0004 (SQL Editor or `supabase db push`), enable storage bucket, create an admin user in Auth + insert into `admin_users`.

## Remaining phases
- **Phase 6 — Localization/RTL audit:** review fr/ar copy, RTL alignment, pluralization.
- **Phase 7 — SEO/a11y polish:** OG/metadata, sitemap, robots, a11y pass, skeletons, toast/validation polish, final visual polish.
- **Phase 8 — E2E testing:** full flows (browse → cart → checkout → order placement → admin CRUD) against the real Supabase project.

## Next steps (priority order)
1. Fix `.env.local` project URL (user copy from dashboard) → re-run connectivity probe (`node` fetch to `https://<host>/rest/v1/` with service role).
2. Apply migrations + seed + storage bucket; create admin user (email/password) and grant `admin_users`.
3. Re-run smoke tests with live data (storefront products/categories render, checkout shows delivery options, admin login works).
4. Phase 6 → Phase 7 → Phase 8.