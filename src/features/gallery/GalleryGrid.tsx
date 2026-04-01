import { WorkCard } from './WorkCard'
import type { Work } from '@/payload-types'

interface GalleryGridProps {
  works: Work[]
}

export function GalleryGrid({ works }: GalleryGridProps) {
  if (works.length === 0) {
    return (
      <div className="text-center py-24 text-muted font-body">
        <p>No hay obras publicadas aún.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {works.map((work) => (
        <WorkCard key={work.id} work={work} />
      ))}
    </div>
  )
}
