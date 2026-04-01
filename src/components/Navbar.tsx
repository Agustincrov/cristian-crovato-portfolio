'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getWhatsAppUrl } from '@/lib/whatsapp'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-sm border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-heading text-xl font-semibold tracking-widest uppercase text-text hover:text-accent transition-colors whitespace-nowrap"
        >
          Cristian Crovato
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          <Link href="/obras" className="font-body text-sm tracking-wider uppercase text-muted hover:text-text transition-colors">
            Obras
          </Link>
          <Link href="/sobre-mi" className="font-body text-sm tracking-wider uppercase text-muted hover:text-text transition-colors">
            Sobre mí
          </Link>
          <Link href="/clientes" className="font-body text-sm tracking-wider uppercase text-muted hover:text-text transition-colors">
            Clientes
          </Link>
          <Link href="/contacto" className="font-body text-sm tracking-wider uppercase text-muted hover:text-text transition-colors">
            Contacto
          </Link>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-bg text-sm font-semibold px-4 py-2 transition-colors"
          >
            <WhatsAppIcon />
            Consultar
          </a>
        </div>

        {/* Mobile: WA icon + hamburger */}
        <div className="flex sm:hidden items-center gap-3">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-bg w-9 h-9 transition-colors"
            aria-label="Consultar por WhatsApp"
          >
            <WhatsAppIcon />
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col justify-center items-center w-9 h-9 gap-1.5 text-text"
            aria-label="Menú"
          >
            <span className={`block h-px w-6 bg-current transition-all duration-200 origin-center ${open ? 'rotate-45 translate-y-[8.5px]' : ''}`} />
            <span className={`block h-px w-6 bg-current transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-6 bg-current transition-all duration-200 origin-center ${open ? '-rotate-45 -translate-y-[8.5px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden bg-bg border-t border-border px-4 py-6 flex flex-col gap-5">
          <Link
            href="/obras"
            onClick={() => setOpen(false)}
            className="font-body text-base tracking-wider uppercase text-muted hover:text-text transition-colors"
          >
            Obras
          </Link>
          <Link
            href="/sobre-mi"
            onClick={() => setOpen(false)}
            className="font-body text-base tracking-wider uppercase text-muted hover:text-text transition-colors"
          >
            Sobre mí
          </Link>
          <Link
            href="/clientes"
            onClick={() => setOpen(false)}
            className="font-body text-base tracking-wider uppercase text-muted hover:text-text transition-colors"
          >
            Clientes
          </Link>
          <Link
            href="/contacto"
            onClick={() => setOpen(false)}
            className="font-body text-base tracking-wider uppercase text-muted hover:text-text transition-colors"
          >
            Contacto
          </Link>
        </div>
      )}
    </header>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}
