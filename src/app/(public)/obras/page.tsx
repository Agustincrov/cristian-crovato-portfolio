import type { Metadata } from 'next'
import { GalleryGrid } from '@/features/gallery/GalleryGrid'
import { ProfileSidebar } from '@/features/gallery/ProfileSidebar'
import { getPublishedWorks } from '@/features/gallery/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Obras — Cristian Crovato',
  description: 'Bustos y esculturas de personajes de comics y fantasía disponibles para encargar.',
  openGraph: {
    title: 'Obras — Cristian Crovato',
    description: 'Bustos y esculturas de personajes de comics y fantasía disponibles para encargar.',
    images: [{ url: '/newphoto2.jpeg', alt: 'Cristian Crovato — Escultor' }],
  },
}

export default async function ObrasPage() {
  const works = await getPublishedWorks()

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex gap-10 items-start">

        {/* Gallery */}
        <div className="flex-1 min-w-0">
          <div className="mb-10">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-accent mb-3">Portfolio</p>
            <h1 className="font-heading text-5xl font-semibold text-text">Obras</h1>
            <p className="text-muted font-body mt-3 text-sm">
              {works.length} {works.length === 1 ? 'pieza' : 'piezas'} · cada una hecha a mano
            </p>
          </div>

          <GalleryGrid works={works} />
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-8">
          <ProfileSidebar />
        </aside>

      </div>
    </div>
  )
}
