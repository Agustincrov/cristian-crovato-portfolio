import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { GalleryGrid } from '@/features/gallery/GalleryGrid'
import { getPublishedWorks } from '@/features/gallery/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  openGraph: {
    title: 'Cristian Crovato — Escultor',
    description: 'Bustos y esculturas de personajes de comics y fantasía, hechos a mano en Córdoba, Argentina.',
    images: [{ url: '/newphoto2.jpeg', alt: 'Cristian Crovato — Escultor' }],
  },
}

export default async function HomePage() {
  const works = await getPublishedWorks()
  const featured = works.slice(0, 6)

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90dvh] flex items-end pb-16 px-4 overflow-hidden bg-bg">
        {/* Hero photo */}
        <Image
          src="/newphoto2.jpeg"
          alt="Cristian Crovato — Escultor"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        {/* Bottom gradient — darkens bottom half so text is readable, transparent at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
        {/* Left vignette — only on desktop where text sits in the left half */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-bg/30 to-transparent hidden lg:block" />

        <div className="relative max-w-6xl mx-auto w-full">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-accent mb-4">
            Escultor Argentino
          </p>
          <h1 className="font-heading text-6xl sm:text-8xl md:text-9xl font-semibold text-text leading-none tracking-tight">
            Cristian<br />Crovato
          </h1>
          <p className="font-body text-muted text-base sm:text-lg mt-6 max-w-md leading-relaxed">
            Bustos y esculturas de personajes de comics y fantasía, hechos a mano en Córdoba, Argentina.
          </p>
          <div className="flex items-center gap-4 mt-10">
            <Link
              href="/obras"
              className="inline-block bg-accent hover:bg-accent-hover text-bg font-body font-bold text-sm uppercase tracking-widest px-8 py-4 transition-colors"
            >
              Ver obras
            </Link>
            <Link
              href="/contacto"
              className="inline-block border border-border hover:border-accent/50 text-muted hover:text-text font-body text-sm uppercase tracking-widest px-8 py-4 transition-colors"
            >
              Contacto
            </Link>
          </div>
        </div>
      </section>

      {/* Featured works */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 mb-8 flex items-baseline justify-between">
            <h2 className="font-heading text-3xl font-semibold text-text">Últimas obras</h2>
            <Link href="/obras" className="font-body text-sm text-muted hover:text-accent transition-colors uppercase tracking-wider">
              Ver todo →
            </Link>
          </div>
          <div className="max-w-6xl mx-auto px-4">
            <GalleryGrid works={featured} />
          </div>
        </section>
      )}
    </>
  )
}
