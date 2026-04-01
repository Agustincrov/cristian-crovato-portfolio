import Link from 'next/link'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { formatNumber } from '@/lib/currency'
import { WhatsAppButton } from './WhatsAppButton'
import { PhotoGallery } from './PhotoGallery'
import type { Work, Media } from '@/payload-types'

interface WorkDetailProps {
  work: Work
  otherWorks?: Work[]
}

export function WorkDetail({ work, otherWorks = [] }: WorkDetailProps) {
  const photos = (work.photos ?? []).map((p) => p.image as Media).filter(Boolean)

  return (
    <article className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <Link
        href="/obras"
        className="inline-flex items-center gap-1 text-muted hover:text-accent text-sm font-body transition-colors mb-8"
      >
        ← Volver a obras
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Photos */}
        <div className="flex flex-col gap-3">
          <PhotoGallery photos={photos} title={work.title} />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          {/* Badge + title */}
          <div>
            <span className={`inline-block text-xs font-body font-semibold px-2 py-1 uppercase tracking-wider mb-3 ${
              work.listingType === 'commission'
                ? 'bg-surface text-accent border border-accent/30'
                : 'bg-accent text-bg'
            }`}>
              {work.listingType === 'commission' ? 'Por encargo' : 'Disponible'}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-text leading-tight">
              {work.title}
            </h1>
          </div>

          {/* Price */}
          {(work.priceARS || work.priceUSD) && (
            <div>
              <PriceBlock priceARS={work.priceARS ?? null} priceUSD={work.priceUSD ?? null} />
            </div>
          )}

          {/* Production time */}
          {work.productionTime && (
            <div className="flex items-center gap-2 text-sm font-body text-muted border-l-2 border-accent pl-3">
              <span>Tiempo de producción:</span>
              <span className="text-text">{work.productionTime}</span>
            </div>
          )}

          {/* Specs */}
          {(work.materials || work.dimensions) && (
            <dl className="grid grid-cols-1 gap-3 border-t border-border pt-4">
              {work.materials && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted font-body">Materiales</dt>
                  <dd className="text-text text-sm font-body mt-1">{work.materials}</dd>
                </div>
              )}
              {work.dimensions && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted font-body">Dimensiones</dt>
                  <dd className="text-text text-sm font-body mt-1">{work.dimensions}</dd>
                </div>
              )}
            </dl>
          )}

          {/* Description */}
          {work.description && (
            <div className="richtext font-body text-sm text-muted leading-relaxed border-t border-border pt-4">
              <RichText data={work.description as Parameters<typeof RichText>[0]['data']} />
            </div>
          )}

          {/* WhatsApp CTA */}
          <div className="mt-6 pt-4">
            <WhatsAppButton workTitle={work.title} size="large" />
            <p className="text-muted text-xs text-center mt-3 font-body">
              Respondemos por WhatsApp · Envíos a todo el mundo
            </p>
          </div>
        </div>
      </div>
      {/* Other works */}
      {otherWorks.length > 0 && (
        <div className="border-t border-border mt-16 pt-12">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-heading text-2xl font-semibold text-text">Otras obras</h2>
            <Link href="/obras" className="font-body text-sm text-muted hover:text-accent transition-colors uppercase tracking-wider">
              Ver todas →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherWorks.map((other) => {
              const img = (other.photos?.[0]?.image as Media | undefined)
              const imgUrl = img?.sizes?.card?.url ?? img?.url ?? null
              const isCommission = other.listingType === 'commission'
              return (
                <Link
                  key={other.id}
                  href={`/obras/${other.slug}`}
                  className="group relative aspect-square overflow-hidden bg-surface block"
                >
                  {imgUrl && (
                    <Image
                      src={imgUrl}
                      alt={img?.alt ?? other.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 p-4">
                    <span className={`inline-block text-xs font-body font-semibold px-2 py-0.5 uppercase tracking-wider mb-1 ${isCommission ? 'bg-bg/70 text-accent border border-accent/40' : 'bg-accent text-bg'}`}>
                      {isCommission ? 'Por encargo' : 'Disponible'}
                    </span>
                    <p className="font-heading text-base font-semibold text-white leading-tight">{other.title}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </article>
  )
}

function PriceBlock({ priceARS, priceUSD }: { priceARS: number | null; priceUSD: number | null }) {
  return (
    <div>
      {priceARS && (
        <div className="flex items-baseline gap-2">
          <span className="font-body text-xs uppercase tracking-widest text-accent">ARS</span>
          <span className="font-body text-3xl font-semibold text-text tabular-nums tracking-tight">
            $ {formatNumber(priceARS)}
          </span>
        </div>
      )}
      {priceUSD && (
        <p className="font-body text-sm text-muted tabular-nums mt-1">
          USD {formatNumber(priceUSD)}
        </p>
      )}
    </div>
  )
}
