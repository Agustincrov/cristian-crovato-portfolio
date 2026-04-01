import { getPayload } from 'payload'
import config from '@payload-config'
import type { Work } from '@/payload-types'

export async function getPublishedWorks(): Promise<Work[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'works',
    where: { status: { equals: 'published' } },
    sort: '-createdAt',
    depth: 1,
  })
  return result.docs
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'works',
    where: {
      and: [
        { slug: { equals: slug } },
        { status: { equals: 'published' } },
      ],
    },
    depth: 1,
    limit: 1,
  })
  return result.docs[0] ?? null
}
