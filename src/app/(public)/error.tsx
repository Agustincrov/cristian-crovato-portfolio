'use client'

import Link from 'next/link'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[70dvh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-accent mb-4">Error</p>
        <h1 className="font-heading text-5xl sm:text-7xl font-semibold text-text mb-4 leading-tight">
          Algo salió mal
        </h1>
        <p className="font-body text-muted text-base max-w-sm mx-auto mb-10 leading-relaxed">
          Ocurrió un error inesperado. Podés intentar de nuevo o volver al inicio.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-block bg-accent hover:bg-accent-hover text-bg font-body font-bold text-sm uppercase tracking-widest px-8 py-4 transition-colors cursor-pointer"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="inline-block border border-border hover:border-accent/50 text-muted hover:text-text font-body text-sm uppercase tracking-widest px-8 py-4 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
