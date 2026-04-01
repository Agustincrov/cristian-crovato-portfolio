import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70dvh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-accent mb-4">404</p>
        <h1 className="font-heading text-5xl sm:text-7xl font-semibold text-text mb-4 leading-tight">
          Página no encontrada
        </h1>
        <p className="font-body text-muted text-base max-w-sm mx-auto mb-10 leading-relaxed">
          La página que buscás no existe o fue movida.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-block bg-accent hover:bg-accent-hover text-bg font-body font-bold text-sm uppercase tracking-widest px-8 py-4 transition-colors"
          >
            Volver al inicio
          </Link>
          <Link
            href="/obras"
            className="inline-block border border-border hover:border-accent/50 text-muted hover:text-text font-body text-sm uppercase tracking-widest px-8 py-4 transition-colors"
          >
            Ver obras
          </Link>
        </div>
      </div>
    </div>
  )
}
