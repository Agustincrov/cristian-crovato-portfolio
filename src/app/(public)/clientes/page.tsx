import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getWhatsAppUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Coleccionistas — Cristian Crovato',
  description: 'Obras de Cristian Crovato en colecciones reales de todo el país y el exterior. Mirá lo que dicen los coleccionistas.',
}

const clients = [
  {
    src: '/client-1.jpg',
    quote: '"El nivel de detalle y pintura es una delicia. Estoy sin palabras."',
    location: 'Coleccionista — Argentina',
  },
  {
    src: '/client-2.jpg',
    quote: '"Simply wow. Fantastic art. You need to make more stuff really."',
    location: 'Coleccionista — Internacional',
  },
  {
    src: '/client-3.jpg',
    quote: '"Se suma YA a mi colección. Genial artista."',
    handle: '@alexispuig',
    location: 'Coleccionista — Argentina',
  },
  {
    src: '/client-4.jpg',
    location: 'Vitrina privada — Punisher & Batman',
  },
  {
    src: '/client-5.jpg',
    location: 'Colección Punisher — Argentina',
  },
  {
    src: '/client-6.jpg',
    location: 'Coleccionista — Buenos Aires',
  },
  {
    src: '/client-7.jpg',
    location: 'Coleccionista — Argentina',
  },
  {
    src: '/client-8.jpg',
    location: 'Vitrina privada — Joker & DC',
  },
  {
    src: '/client-9.jpg',
    location: 'Vitrina privada — colección completa',
  },
  {
    src: '/client-10.jpg',
    location: 'Colección Batman — Argentina',
  },
  {
    src: '/client-11a.jpg',
    location: 'N. Chaffman — Colección Lobo',
  },
  {
    src: '/client-11b.jpg',
    location: 'Colección Spawn — Argentina',
  },
]

export default function ClientesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">

      {/* Hero */}
      <div className="mb-16 max-w-2xl">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-accent mb-3">Coleccionistas</p>
        <h1 className="font-heading text-5xl lg:text-6xl font-semibold text-text leading-tight mb-4">
          Obras que<br />ya tienen hogar
        </h1>
        <p className="font-body text-muted text-lg leading-relaxed">
          Coleccionistas de Buenos Aires, La Rioja, Rosario, Ushuaia y del exterior
          que eligieron una pieza de Cristian Crovato para su colección.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 border-t border-b border-border py-8 mb-16">
        {[
          { n: '200+', label: 'Piezas entregadas' },
          { n: '10+', label: 'Provincias del país' },
          { n: '5+', label: 'Países en el mundo' },
        ].map(({ n, label }) => (
          <div key={label} className="text-center">
            <p className="font-heading text-3xl lg:text-4xl font-semibold text-accent">{n}</p>
            <p className="font-body text-xs uppercase tracking-wider text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 mb-20">
        {clients.map(({ src, quote, handle, location }) => (
          <div key={src} className="break-inside-avoid">
            <div className="relative overflow-hidden bg-surface border border-border group">
              <Image
                src={src}
                alt={location}
                width={800}
                height={800}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized
              />
            </div>
            {(quote || location) && (
              <div className="pt-3 pb-1">
                {quote && (
                  <p className="font-body text-sm text-muted italic leading-relaxed mb-1">{quote}</p>
                )}
                <div className="flex items-center gap-2">
                  {handle && (
                    <span className="font-body text-xs text-accent">{handle}</span>
                  )}
                  {handle && <span className="text-border">·</span>}
                  <p className="font-body text-xs text-muted uppercase tracking-wider">{location}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Testimonial highlight */}
      <div className="border border-border p-8 mb-20 text-center">
        <p className="font-heading text-2xl lg:text-3xl text-text leading-relaxed mb-4">
          "Cristian you need to make more stuff really."
        </p>
        <p className="font-body text-xs uppercase tracking-[0.3em] text-accent">
          Comprador internacional — WhatsApp
        </p>
      </div>

      {/* CTA */}
      <div className="border-t border-border pt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-heading text-2xl font-semibold text-text">¿Querés ser el próximo?</p>
          <p className="font-body text-sm text-muted mt-1">Consultá disponibilidad o pedí tu pieza por encargo.</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/obras"
            className="font-body text-sm uppercase tracking-wider text-muted hover:text-accent transition-colors border border-border px-5 py-3"
          >
            Ver obras
          </Link>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body font-bold text-sm uppercase tracking-widest bg-accent hover:bg-accent-hover text-bg px-5 py-3 transition-colors"
          >
            Consultar
          </a>
        </div>
      </div>

    </div>
  )
}
