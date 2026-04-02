import { getPayload } from 'payload'
import config from '@payload-config'
import works from './data/works.json'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function toRichText(text: string) {
  return {
    root: {
      children: [
        {
          children: [
            { detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

async function seed() {
  const payload = await getPayload({ config })

  for (const work of works) {
    // Idempotency check
    const existing = await payload.find({
      collection: 'works',
      where: { slug: { equals: work.slug } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      console.log(`↷ skipped (exists): ${work.title}`)
      continue
    }

    // Upload all photos
    const uploadedPhotos: { image: number }[] = []
    for (const filename of work.images) {
      const imagePath = path.join(__dirname, 'data/images', filename)
      if (!fs.existsSync(imagePath)) {
        console.error(`  ✗ image not found: ${imagePath}`)
        continue
      }
      const imageBuffer = fs.readFileSync(imagePath)
      const media = await payload.create({
        collection: 'media',
        data: { alt: work.title },
        file: {
          data: imageBuffer,
          name: filename,
          mimetype: 'image/jpeg',
          size: imageBuffer.length,
        },
      })
      uploadedPhotos.push({ image: media.id })
    }

    if (uploadedPhotos.length === 0) {
      console.error(`✗ no images uploaded for: ${work.title}`)
      continue
    }

    // Create work
    await payload.create({
      collection: 'works',
      data: {
        title: work.title,
        slug: work.slug,
        description: toRichText(work.description),
        materials: work.materials,
        dimensions: work.dimensions,
        listingType: work.listingType as 'available' | 'commission',
        priceUSD: work.priceUSD,
        priceARS: work.priceARS,
        productionTime: work.productionTime,
        status: work.status as 'published' | 'draft',
        metaDescription: work.metaDescription,
        photos: uploadedPhotos,
      },
    })

    console.log(`✓ created: ${work.title}`)
  }

  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
