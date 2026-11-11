# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Storefront for **The Details**, a Casablanca brand selling vintage / Y2K belts, cases and rings (cash on delivery only, prices in DH). Dark theme only. The app lives in `my-app/`; the sibling `../images/` folder holds raw source photos and `../the-details-dark.html` is the original design mockup.

## Commands

Run from `my-app/`:

- `npm run dev` / `npm run build` / `npm run lint`. There is no test suite.
- `npx tsc --noEmit` for a quick type check.
- **If styles or classes look stale in the dev server, restart it with a clean cache**: `pkill -f "next dev"; rm -rf .next; npm run dev`. Turbopack has repeatedly served an old stylesheet after `globals.css` edits, and running `npm run build` while `next dev` is up can also corrupt `.next`.
- `npm run lint` currently reports one known error (`Year` in `components/site/footer.tsx` sets state in an effect) plus a few unused-import warnings. Don't treat them as new regressions.

## Next.js version

This is Next 16 (React 19, Tailwind 4). `AGENTS.md` says its APIs differ from older versions: read the relevant guide in `node_modules/next/dist/docs/` before using unfamiliar APIs. `cacheComponents` is enabled in `next.config.ts`, so dynamic routes need `generateStaticParams` and `params` is a Promise.

## Architecture

- **Data is code, not a database.** `lib/data.ts` holds the product list, categories, FAQ, nav and footer links, and the flat delivery fee (`DELIVERY_FEE`). Products are built with the `img(slug, count)` helper, which expects files `public/images/products/<slug>-0.webp` (the hand-picked main photo), `-1`, `-2`... The list is sorted belts, then cases, then rings. Prices marked `// TODO price` are provisional guesses awaiting the owner.
- **Routes:** `/` (sections in `components/site/*`), `/products` (filterable list), `/products/[slug]`, `/wishlist`, `app/not-found.tsx`, and API routes `/api/contact`, `/api/subscribe`, `/api/order`. The API routes validate with zod and return `{ ok: true }` but **do not deliver or store anything yet** (each has a TODO). `/api/order` recomputes prices and the delivery fee on the server from `lib/data.ts`; never trust prices from the client.
- **Client state is Zustand** (`stores/cart-store.ts`, `stores/favorites-store.ts`), persisted to localStorage with `skipHydration: true`. `components/providers.tsx` calls `persist.rehydrate()` after mount (so SSR output matches), runs Lenis smooth scroll, scrolls to top on route change unless the URL has a hash, and mounts the global `CartDrawer` next to `QueryClientProvider`. Server data and mutations go through TanStack Query hooks in `hooks/` using the axios instance in `lib/axios.ts` (`baseURL: "/api"`). Errors surface as Sonner toasts via `getErrorMessage` in `lib/errors.ts`.
- **Forms** validate with the zod schemas in `lib/schemas.ts` (shared by client and API routes).
- **Product options:** `productOptions(p)` in `lib/data.ts` decides what the customer must pick (belts default to "Standard size"; rings use `sizes` plus `optionLabel: "Pack"`). `ProductCard` (exported from `components/site/best-sellers.tsx`, a client component) and `product-detail.tsx` both use it.
- **Navbar and Footer take a `base` prop.** Their links are `#section` anchors. Pass `base="/"` on pages other than home so they become `/#section`.
- **Images:** `next.config.ts` sets `images.loader: "custom"` with `lib/image-loader.ts`, so nothing goes through `/_next/image` (Vercel's optimizer quota ran out). Local images are served as-is, so keep files small (.webp, about 1000px wide). Shopify CDN URLs get `?width=`. Next logs a harmless "loader does not implement width" warning.
- **Styling:** all colours, fonts (`next/font`: Bebas Neue, Gloock, Archivo, UnifrakturCook), radii and shadows are tokens in `app/globals.css` (`@theme inline`); avoid hard-coded hex in components. Responsive variants `tablet:` (max 900px) and `phone:` (max 600px) are custom variants defined there. Hover motion relies on Tailwind v4's separate `scale` / `translate` properties; the global transition list in `globals.css` includes them, so don't reduce it to `transform`. Utility classes `.link-underline` and `.flip` (nav text roll) live at the bottom of `globals.css`.
- **UI primitives:** shadcn "base-nova" components in `components/ui` (built on `@base-ui/react`, not Radix). `components/site/custom-select.tsx` is the site's own dropdown, used instead of native `<select>`.
- Tap targets are kept at least 44px.

## Business rules reflected in the UI

- Payment: cash on delivery only. Never mention other payment methods.
- Delivery: flat 30 DH anywhere in Casablanca, no free areas (FAQ, product pages, cart and `/api/order` all use this).
- Still-marked placeholders: `[YOUR WHATSAPP]` in the contact section, and social links (Instagram, TikTok, WhatsApp), Privacy and Terms are `#` stubs.

## Working on macOS

`sed -i` needs an empty suffix argument (`sed -i '' ...`) and has no `\|` alternation; prefer a small Python script or the Edit tool for multi-line edits.
