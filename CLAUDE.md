# Cristian Crovato — Sculptor Portfolio Site

## Project Overview
Portfolio + lead generation site for Argentine sculptor Cristian Crovato. Converts visitors into WhatsApp inquiries. No cart, no checkout — all sales close on WhatsApp.

## Tech Stack
- **Next.js** 15.2.9 (pinned — Payload peer dep requires `>=15.2.9 <15.3.0 || >=15.3.9` etc.)
- **Payload CMS** v3 (integrated with Next.js, single container)
- **Database** PostgreSQL 16
- **Styling** Tailwind CSS v3
- **Fonts** Cormorant Garamond (headings) + Inter (body) via next/font
- **Hosting target** Railway (São Paulo) + Cloudflare CDN

## Docker Setup
```bash
# Start all services
docker-compose up -d

# Rebuild after adding npm packages
docker-compose build --no-cache next && docker-compose up -d

# After volume issues
docker-compose down -v && docker-compose up -d

# Logs
docker-compose logs next --tail=50
```

**Local dev port: 3001** (3000 is occupied by another project on this machine)
- App: http://localhost:3001
- Admin: http://localhost:3001/admin
- DB: localhost:5432

## Environment Variables (.env)
- `DATABASE_URI` — PostgreSQL connection string
- `PAYLOAD_SECRET` — Payload auth secret
- `ARS_PER_USD` — Exchange rate for dual-currency display (e.g. 1160)

## Key Business Rules
- All UI copy in **Argentine Spanish**
- Prices: ARS is primary (`priceARS`), USD is secondary reference (`priceUSD`), displayed as "ARS 290.000 / USD 250"
- WhatsApp CTA on every work detail page — pre-filled message: "Hola Cristian, me interesa la escultura [nombre]"
- WhatsApp number: +54 9 3517 06-4453 (URL format: 5493517064453)
- Mobile-first (traffic comes from Instagram/Meta Ads)
- International buyers exist — shipping discussed via WhatsApp only

## Payload CMS Collections
- **Works** — title, slug, description (richText), materials, dimensions, photos, listingType (commission|available), priceARS, priceUSD, productionTime, status (published|draft), metaDescription
- **Media** — image uploads with 3 sizes: thumbnail (400px), card (800px), full (1600px)
- **Users** — single admin user (Cristian), Payload built-in auth

## Project Structure
```
src/
  app/(public)/          # Homepage, /obras, /obras/[slug], /sobre-mi, /clientes, /contacto
  app/(payload)/         # Payload admin at /admin
  features/gallery/      # GalleryGrid, WorkCard, ProfileSidebar, queries
  features/work-detail/  # WorkDetail, PhotoGallery, WhatsAppButton
  collections/           # Works.ts, Media.ts, Users.ts
  lib/                   # currency.ts, whatsapp.ts
  components/            # Navbar.tsx, Footer.tsx
  payload.config.ts
public/                  # Static images (kebab-case names only): heroes, cristian-profile,
                         # articulo-*, proceso-*, client-*
playwright/tests/        # e2e tests (dev/CI only, not production)
docker/
  next/Dockerfile
  playwright/Dockerfile
```

## Admin Setup Pattern (Payload v3 + Next.js)

**No root `app/layout.tsx`** — deleted. Each route group has its own full HTML structure:
- `(public)/layout.tsx` → has `<html><body>` + fonts + Navbar/Footer
- `(payload)/layout.tsx` → uses Payload's `RootLayout` which has its own `<html><body>`

**Consequence: no global `app/not-found.tsx` is possible.** Next.js requires a root layout to wrap `app/not-found.tsx` — without one it throws a build error. Place `not-found.tsx` and `error.tsx` inside `(public)/` instead. They inherit the public layout and cover all real visitor-facing 404s (e.g. `/obras/nonexistent-slug`). Truly unknown top-level routes (e.g. `/foo`) fall back to Next.js's bare default — acceptable for this site's traffic pattern. Do not attempt `app/not-found.tsx` again.

**`(payload)/layout.tsx`** must use `RootLayout` + `handleServerFunctions` from `@payloadcms/next/layouts`:
```tsx
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'

export default async function Layout({ children }) {
  const configPromise = import('@payload-config').then(m => m.default)
  async function serverFunction(args) {
    'use server'
    return handleServerFunctions({ ...args, config: configPromise, importMap })
  }
  return <RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
}
```

**`(payload)/admin/[[...segments]]/page.tsx`** must unwrap the ES module default:
```tsx
// CORRECT — .then(m => m.default) unwraps module namespace
config: import('@payload-config').then(m => m.default)

// WRONG — dynamic import returns { default: config }, not config itself
config: import('@payload-config')
```

## Design System
- Background: `#0d0d0d` (near-black)
- Text: `#f0ede8` (off-white)
- Accent: `#b07d4a` (copper/bronze)
- Feel: premium gallery / collectible — not a generic shop

## Phase 2 (after launch)
Meta Ads campaign — bilingual (ES/EN) ad copy, retargeting via Meta Pixel (integrated from start).
