# Changelog

All notable changes to this project will be documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- New photos from Cristian integrated across the site (2026-04-01)
  - Homepage hero replaced with group shot of Punisher, Spider-Man and Daredevil (`newphoto2.jpeg`)
  - Sobre mí: portfolio overview collage added between bio and process sections (`newphoto1.jpeg`)
  - Sobre mí: process banner replaced with exhibition photo of Logan, Batman and Punisher (`newphoto4.jpeg`)
  - Batman work entry: two new close-up photos added to seed data (`newphoto3.jpeg`, `newphoto5.jpeg`)
- `(public)/not-found.tsx` — on-brand 404 page with Navbar, Footer and CTAs (2026-04-01)
- `(public)/error.tsx` — client-side error boundary with retry and home buttons (2026-04-01)
- Open Graph meta tags on all public pages (2026-04-01)
  - Work detail pages: dynamic `og:title`, `og:description`, `og:image` from first sculpture photo
  - Homepage and `/obras`: static OG image from hero photo
  - `metadataBase` set via `NEXT_PUBLIC_SERVER_URL` — must be set to the production domain on Railway

### Changed
- Price display on work detail pages: ARS shown as `$ 348.000` (Inter, tabular-nums) with separate "ARS" label in copper; USD shown below as reference (2026-04-01)

---

## [0.1.0] - 2026-03-21 — Initial build (pre-launch)

### Added
- Next.js 15.2.9 + Payload CMS v3 + PostgreSQL 16, fully Dockerized
- Two independent root layouts: `(public)` (Navbar + Footer) and `(payload)` (Payload admin)
- **Homepage** (`/`) — full-bleed hero, featured works grid
- **Gallery** (`/obras`) — responsive 3-column grid with sticky profile sidebar
- **Work detail** (`/obras/[slug]`) — photo gallery with lightbox, specs, WhatsApp CTA, related works
- **Sobre mí** (`/sobre-mi`) — bio, process steps (5 stages), press coverage
- **Clientes** (`/clientes`) — masonry grid of collector photos, stats, testimonial
- **Contacto** (`/contacto`) — ArtStation-style profile with social links
- **Admin** (`/admin`) — Payload CMS with Works, Media and Users collections
- Design system: near-black background, off-white text, copper accent, Cormorant Garamond + Inter
- Dual-currency pricing: ARS as primary display, USD as international reference
- WhatsApp CTA on every work detail page with pre-filled message
- HTTP security headers (CSP, HSTS, X-Frame-Options, etc.)
- Seed/reset scripts (`npm run seed`, `npm run reset`, `npm run reset:seed`)
- 10 real sculptures seeded with photos from Cristian
- Playwright e2e test suite: 260 tests across Mobile Chrome and Desktop Chrome
- `DOCS.md` — full infrastructure, workflow and architecture documentation in Spanish
