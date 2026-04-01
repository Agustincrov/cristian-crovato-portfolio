import Link from 'next/link'
import { getWhatsAppUrl } from '@/lib/whatsapp'

export function Footer() {
  return (
    <footer className="border-t border-border mt-24 py-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-start gap-8">
        <div>
          <p className="font-heading text-lg font-semibold tracking-widest uppercase text-text">
            Cristian Crovato
          </p>
          <p className="text-muted text-sm mt-1">Escultor — Córdoba, Argentina</p>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/obras" className="text-muted hover:text-text transition-colors">Obras</Link>
          <Link href="/sobre-mi" className="text-muted hover:text-text transition-colors">Sobre mí</Link>
          <Link href="/clientes" className="text-muted hover:text-text transition-colors">Clientes</Link>
          <Link href="/contacto" className="text-muted hover:text-text transition-colors">Contacto</Link>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent transition-colors"
          >
            WhatsApp
          </a>
          <a
            href="https://www.instagram.com/cristiancrovato/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-text transition-colors"
          >
            Instagram
          </a>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 pt-8 border-t border-border">
        <p className="text-muted text-xs">
          © {new Date().getFullYear()} Cristian Crovato. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
