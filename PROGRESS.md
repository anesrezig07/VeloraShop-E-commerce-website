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
- Migrations `supabase/migrations/0001_initial_schema.sql` … `0005_grants.sql`:
  - Tables: `products`, `product_variants`, `product_images`, `categories`, `wilayas` (58), `delivery_rates`, `customers`, `orders`, `order_items`, `admin_users`.
  - RLS: storefront reads only `is_active` data; admin tables gated by `public.is_admin()`; guest order placement via `place_order(...)` PL/pgSQL RPC (service-role only, atomic, recomputes prices, checks/decrements stock, computes delivery fee from `delivery_rates`, returns order number/totals).
  - Seed data + storage bucket for product images.
  - `0005_grants.sql`: explicit grants for `anon`/`authenticated`/`service_role` (required after `supabase db push` — default privileges don't cover CLI-created tables).
- **Applied** to the live Supabase project (`jmqpmzkowhmkyucalyrc`) via `supabase db push --linked`; verified live data: 58 wilayas, 33 products, 9 categories, 58 delivery_rates, 12 product_variants, 41 product_images. Storage bucket `product-images` exists (public, 5 MB, jpeg/png/webp).
- Admin user created in Auth via `/auth/v1/signup` (email confirmed) + `admin_users` row: `admin@velorashop.com`. Sign-in + admin RLS verified (reads `orders`, `admin_users`).

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

- `vercel.json` (`{"framework": "nextjs"}`) + `src/app/page.tsx` (redirect `/` → `/${defaultLocale}`) fix the Vercel 404 ("No Output Directory named 'public'") caused by the "Other" framework preset.
- `.env.local`: `NEXT_PUBLIC_SUPABASE_URL` set to bare base URL (a `/rest/v1/` suffix breaks the supabase client).

## Verification status
- `npx tsc --noEmit` ✅ clean · `npm run lint` ✅ clean · `npm run build` ✅ passes (storefront SSG/static, admin mostly SSG, orders/order-detail/products dynamic) · smoke tests ✅.
- Live smoke tests: `/` 307 → `/fr` 200, `/ar` 200, `/fr/products` 200 (real products render), `/fr/categories` 200, `/fr/checkout` 200, `/fr/admin/login` 200, `/fr/admin` 307.

## Phase 6 — Localization/RTL audit (done)
- Dictionary parity enforced by `ar: Dictionary = typeof fr` (type-checked; tsc clean).
- RTL: `<html dir>`/`lang` set per locale; icons flip via `rtl:rotate-180`; no hardcoded `ml-`/`mr-`/`text-left`/`space-x` in storefront/app components; admin Arabic inputs force `dir="rtl"`.
- Fixed `formatEstimatedDelivery` Arabic pluralization (`${min} يوم` → `${min} يوم` for 1, `${min} أيام` for >1).
- Number/date formatting: `formatPrice` uses `fr-FR` grouping (Western digits, space separators — the Algerian convention) for both locales; `formatDate`/`formatDateTime` use `ar-DZ`/`fr-DZ`.

## Phase 7 — SEO/a11y polish (done)
- `src/lib/constants.ts`: `SITE_URL` constant (env `NEXT_PUBLIC_SITE_URL`, fallback `https://velora-shop-e-commerce-website-five.vercel.app`).
- `src/lib/seo.ts`: `localeAlternates(path, locale)` helper (canonical + fr/ar/x-default hreflang).
- `sitemap.ts` (dynamic, `/sitemap.xml`): fr/ar alternates for `/`, `/products`, `/categories`, all active products (with `lastModified` from `updated_at`) and categories.
- `robots.ts` (`/robots.txt`): allow all, disallow `/admin` (incl. fr/ar prefixed), sitemap URL. Excluded `robots.txt`/`sitemap.xml` from `proxy.ts` matcher (was redirecting them to `/fr/robots.txt` → 404).
- Metadata: locale-aware `generateMetadata` in locale layout (fr/ar descriptions, OG `locale: fr_DZ`/`ar_DZ`), homepage, products, categories, category detail, product detail (canonical + hreflang + OG `url`/image). Admin layout + login + cart/checkout/success noindexed.
- Formatting fixes for Arabic: cart/checkout/success/delivery-fee prices now use `formatPrice` (`دج` instead of `DA`); delivery ETA uses `formatEstimatedDelivery` (Arabic "أيام").
- i18n: hero ETA/verification lines now dictionary-driven (`heroDeliveryEta`, `heroVerifyAtReception`) instead of hardcoded French.
- Verified live: `/robots.txt` + `/sitemap.xml` serve; canonical/hreflang/noindex render correctly; `ar` page is `lang=ar dir=rtl`.

## Remaining phases
- **Phase 8 — E2E testing:** full flows (browse → cart → checkout → order placement → admin CRUD) against the real Supabase project.

## Next steps (priority order)
1. Phase 8 — E2E against live data.