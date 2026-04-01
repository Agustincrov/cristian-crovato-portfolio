import Link from 'next/link'
import Image from 'next/image'
import { formatARS, formatUSD } from '@/lib/currency'
import type { Work, Media } from '@/payload-types'

interface WorkCardProps {
  work: Work
}

export function WorkCard({ work }: WorkCardProps) {
  const firstPhoto = work.photos?.[0]?.image as Media | undefined
  const imageUrl = firstPhoto?.sizes?.card?.url ?? firstPhoto?.url ?? null

  const isCommission = work.listingType === 'commission'

  return (
    <Link
      href={`/obras/${work.slug}`}
      className="group block relative aspect-square overflow-hidden bg-surface"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={firstPhoto?.alt ?? work.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted text-sm bg-border">
          Sin foto
        </div>
      )}

      {/* Bottom gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-16 p-4">
        <span className={`inline-block text-xs font-body font-semibold px-2 py-0.5 uppercase tracking-wider mb-2 ${
          isCommission
            ? 'bg-bg/70 text-accent border border-accent/40'
            : 'bg-accent text-bg'
        }`}>
          {isCommission ? 'Por encargo' : 'Disponible'}
        </span>
        <h3 className="font-heading text-base font-semibold text-white leading-tight">
          {work.title}
        </h3>
        {(work.priceARS || work.priceUSD) && (
          <div className="mt-1 font-body">
            {work.priceARS && <p className="text-white/80 text-xs">{formatARS(work.priceARS)}</p>}
            {work.priceUSD && <p className="text-white/50 text-xs">{formatUSD(work.priceUSD)}</p>}
          </div>
        )}
      </div>
    </Link>
  )
}
