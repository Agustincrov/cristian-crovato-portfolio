'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'

interface PhotoGalleryProps {
  photos: Media[]
  title: string
}

export function PhotoGallery({ photos, title }: PhotoGalleryProps) {
  const [selected, setSelected] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const prev = useCallback(() => setSelected(i => (i - 1 + photos.length) % photos.length), [photos.length])
  const next = useCallback(() => setSelected(i => (i + 1) % photos.length), [photos.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, prev, next])

  if (photos.length === 0) {
    return (
      <div className="aspect-square bg-surface flex items-center justify-center text-muted font-body text-sm">
        Sin fotos
      </div>
    )
  }

  const current = photos[selected]
  const mainUrl = current.sizes?.full?.url ?? current.url ?? ''
  const thumbUrl = (p: Media) => p.sizes?.thumbnail?.url ?? p.url ?? ''

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image — click to open lightbox */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="relative aspect-square w-full overflow-hidden bg-surface group cursor-zoom-in focus:outline-none"
          aria-label="Ver imagen ampliada"
        >
          <Image
            src={mainUrl}
            alt={current.alt ?? title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Zoom hint */}
          <div className="absolute bottom-3 right-3 bg-bg/70 backdrop-blur-sm text-text/80 text-xs font-body px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
            ⊕ Ampliar
          </div>
        </button>

        {/* Thumbnail strip — all photos, including first */}
        {photos.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {photos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`relative w-20 h-20 overflow-hidden bg-surface flex-shrink-0 transition-all focus:outline-none ${
                  i === selected
                    ? 'ring-2 ring-accent ring-offset-1 ring-offset-bg'
                    : 'opacity-60 hover:opacity-100'
                }`}
                aria-label={`Ver foto ${i + 1}`}
              >
                <Image
                  src={thumbUrl(photo)}
                  alt={photo.alt ?? `${title} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none font-light z-10"
            aria-label="Cerrar"
          >
            ✕
          </button>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl leading-none z-10 p-2"
              aria-label="Foto anterior"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-h-[90dvh] max-w-[90vw] w-full h-full flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={current.sizes?.full?.url ?? current.url ?? ''}
              alt={current.alt ?? title}
              className="max-h-[90dvh] max-w-[90vw] object-contain"
            />
          </div>

          {/* Next */}
          {photos.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl leading-none z-10 p-2"
              aria-label="Foto siguiente"
            >
              ›
            </button>
          )}

          {/* Counter */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm font-body">
              {selected + 1} / {photos.length}
            </div>
          )}
        </div>
      )}
    </>
  )
}
