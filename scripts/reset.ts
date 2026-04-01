import { getPayload } from 'payload'
import config from '@payload-config'

async function reset() {
  const payload = await getPayload({ config })

  const works = await payload.find({ collection: 'works', limit: 1000 })
  for (const work of works.docs) {
    await payload.delete({ collection: 'works', id: work.id })
  }
  console.log(`✓ deleted ${works.docs.length} works`)

  const media = await payload.find({ collection: 'media', limit: 1000 })
  for (const item of media.docs) {
    await payload.delete({ collection: 'media', id: item.id })
  }
  console.log(`✓ deleted ${media.docs.length} media items`)

  process.exit(0)
}

reset().catch((err) => {
  console.error(err)
  process.exit(1)
})
