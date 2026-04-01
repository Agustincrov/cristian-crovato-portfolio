# Cristian Crovato — Sculptor Portfolio

Production portfolio and lead generation site for Argentine sculptor Cristian Crovato. Converts visitors into WhatsApp inquiries — no cart, no checkout.

## Stack

- **Next.js 15** (App Router) + **Payload CMS v3** — integrated in a single container
- **PostgreSQL 16** — managed via Railway in production, Docker locally
- **Tailwind CSS v3** — custom design system (near-black bg, copper accent, Cormorant Garamond + Inter)
- **Docker** — local dev environment via `docker-compose`
- **Railway** — production hosting (São Paulo) + Cloudflare CDN
- **Playwright** — 260 e2e tests across Mobile Chrome and Desktop Chrome

## Features

- Full-bleed hero, featured works grid, and work detail pages with photo gallery + lightbox
- Dual-currency pricing (ARS primary, USD reference for international buyers)
- WhatsApp CTA on every work detail page with pre-filled message
- Payload CMS admin for managing works, media, and users
- Open Graph meta tags for WhatsApp/Instagram preview cards
- HTTP security headers (CSP, HSTS, X-Frame-Options)
- Idempotent seed/reset scripts for reproducible data setup

## Local Development

Requires Docker and Docker Compose.

```bash
cp .env.example .env   # fill in values
docker-compose up -d
# App: http://localhost:3001
# Admin: http://localhost:3001/admin
```

Seed the database:

```bash
npm run seed        # idempotent seed
npm run reset:seed  # wipe + reseed
```

Run e2e tests (inside the playwright container):

```bash
docker-compose run playwright npx playwright test
```

## Project Structure

```
src/
  app/(public)/          # Homepage, /obras, /obras/[slug], /sobre-mi, /clientes, /contacto
  app/(payload)/         # Payload CMS admin
  features/              # Feature-sliced: gallery, work-detail
  collections/           # Payload collections: Works, Media, Users
  lib/                   # currency.ts, whatsapp.ts
  components/            # Navbar, Footer
playwright/tests/        # e2e test suite
scripts/                 # seed.ts, reset.ts, data/works.json
docker/                  # Dockerfiles for next and playwright
```

> Client photos are not included in this repository.
