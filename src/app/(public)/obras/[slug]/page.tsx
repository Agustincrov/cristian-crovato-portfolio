import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { WorkDetail } from '@/features/work-detail/WorkDetail'
import { getWorkBySlug, getPublishedWorks } from '@/features/gallery/queries'
import type { Media } from '@/payload-types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const works = await getPublishedWorks()
  return works.map((work) => ({ slug: work.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const work = await getWorkBySlug(slug)
  if (!work) return {}

  const description = work.metaDescription ?? `Escultura de ${work.title} hecha a mano por Cristian Crovato.`
  const firstPhoto = work.photos?.[0]?.image as Media | undefined
  const ogImageUrl = firstPhoto?.sizes?.full?.url ?? firstPhoto?.url ?? null

  return {
    title: `${work.title} — Cristian Crovato`,
    description,
    openGraph: {
      title: `${work.title} — Cristian Crovato`,
      description,
      type: 'website',
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1600, alt: work.title }],
      }),
    },
  }
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params
  const [work, allWorks] = await Promise.all([
    getWorkBySlug(slug),
    getPublishedWorks(),
  ])

  if (!work) notFound()

  const otherWorks = allWorks.filter((w) => w.slug !== slug).slice(0, 3)

  return <WorkDetail work={work} otherWorks={otherWorks} />
}
