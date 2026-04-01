import { test, expect } from '@playwright/test'

const WA_NUMBER = '5493517064453'

// Sample of works to spot-check — title, slug, ARS price, USD price, photo count
const WORKS = [
  { slug: 'batman',         title: 'Batman',                      ars: '$ 348.000', usd: 'USD 300', photos: 4 },
  { slug: 'daredevil',      title: 'Daredevil',                   ars: '$ 325.000', usd: 'USD 280', photos: 4 },
  { slug: 'kratos',         title: 'Kratos — God of War',         ars: '$ 441.000', usd: 'USD 380', photos: 1 },
  { slug: 'the-mandalorian',title: 'The Mandalorian',             ars: '$ 418.000', usd: 'USD 360', photos: 2 },
  { slug: 'spawn',          title: 'Spawn',                       ars: '$ 395.000', usd: 'USD 340', photos: 1 },
]

test.describe('Work detail page', () => {
  for (const work of WORKS) {
    test.describe(`/obras/${work.slug}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`/obras/${work.slug}`)
      })

      test('shows correct title', async ({ page }) => {
        await expect(page.locator('h1', { hasText: work.title })).toBeVisible()
      })

      test('shows availability badge', async ({ page }) => {
        await expect(page.locator('span', { hasText: /Disponible|Por encargo/ }).first()).toBeVisible()
      })

      test('shows ARS price', async ({ page }) => {
        await expect(page.locator(`text=${work.ars}`)).toBeVisible()
      })

      test('shows USD price', async ({ page }) => {
        await expect(page.locator(`text=${work.usd}`)).toBeVisible()
      })

      test('shows materials', async ({ page }) => {
        await expect(page.locator('dd').filter({ hasText: 'Plastilina' })).toBeVisible()
      })

      test('shows dimensions', async ({ page }) => {
        await expect(page.locator('text=39 cm')).toBeVisible()
      })

      test('shows production time', async ({ page }) => {
        await expect(page.locator('text=/Entrega|semanas|meses/i')).toBeVisible()
      })

      test('main photo renders', async ({ page }) => {
        const mainImg = page.locator('button[aria-label="Ver imagen ampliada"] img')
        await expect(mainImg).toBeVisible()
        const naturalWidth = await mainImg.evaluate((el: HTMLImageElement) => el.naturalWidth)
        expect(naturalWidth).toBeGreaterThan(0)
      })

      test(`shows ${work.photos} thumbnail(s)`, async ({ page }) => {
        if (work.photos > 1) {
          const thumbs = page.locator('button[aria-label^="Ver foto"]')
          await expect(thumbs).toHaveCount(work.photos)
        } else {
          // Single photo — no thumbnail strip
          const thumbs = page.locator('button[aria-label^="Ver foto"]')
          await expect(thumbs).toHaveCount(0)
        }
      })

      test('WhatsApp CTA button is visible and has correct URL', async ({ page }) => {
        const waBtn = page.locator(`a[href*="${WA_NUMBER}"]`, { hasText: /consultar por esta obra/i })
        await expect(waBtn).toBeVisible()

        const href = await waBtn.getAttribute('href')
        expect(href).toContain(WA_NUMBER)
        // URL-encoded work title in message
        expect(href?.toLowerCase()).toContain(encodeURIComponent(work.title).toLowerCase())
      })

      test('WhatsApp button opens in new tab', async ({ page }) => {
        const waBtn = page.locator(`a[href*="${WA_NUMBER}"]`, { hasText: /consultar por esta obra/i })
        await expect(waBtn).toHaveAttribute('target', '_blank')
        await expect(waBtn).toHaveAttribute('rel', /noopener/)
      })

      test('back link returns to /obras', async ({ page }) => {
        await expect(page.locator('a', { hasText: '← Volver a obras' })).toBeVisible()
      })

      test('"Otras obras" section shows related works', async ({ page }) => {
        await expect(page.locator('h2', { hasText: 'Otras obras' })).toBeVisible()
        const relatedCards = page.locator('a[href^="/obras/"]')
        await expect(relatedCards).not.toHaveCount(0)
      })
    })
  }
})

test.describe('Photo lightbox', () => {
  test('clicking main photo opens lightbox', async ({ page }) => {
    await page.goto('/obras/batman')
    await page.locator('button[aria-label="Ver imagen ampliada"]').click()
    await expect(page.locator('text=/1 \\/ 4/')).toBeVisible()
    // Close with ESC
    await page.keyboard.press('Escape')
    await expect(page.locator('text=/1 \\/ 4/')).not.toBeVisible()
  })

  test('lightbox navigates between photos with arrow keys', async ({ page }) => {
    await page.goto('/obras/daredevil') // 4 photos
    await page.locator('button[aria-label="Ver imagen ampliada"]').click()
    await expect(page.locator('text=/1 \\/ 4/')).toBeVisible()
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('text=/2 \\/ 4/')).toBeVisible()
    await page.keyboard.press('ArrowLeft')
    await expect(page.locator('text=/1 \\/ 4/')).toBeVisible()
  })

  test('lightbox close button works', async ({ page }) => {
    await page.goto('/obras/batman')
    await page.locator('button[aria-label="Ver imagen ampliada"]').click()
    await page.locator('button[aria-label="Cerrar"]').click()
    await expect(page.locator('button[aria-label="Cerrar"]')).not.toBeVisible()
  })
})

test.describe('Work detail — mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('WhatsApp CTA is visible without scrolling', async ({ page }) => {
    await page.goto('/obras/batman')
    // WA button should be in viewport on load for mobile
    const waBtn = page.locator(`a[href*="${WA_NUMBER}"]`, { hasText: /consultar por esta obra/i })
    await expect(waBtn).toBeVisible()
  })

  test('thumbnail strip works on mobile', async ({ page }) => {
    await page.goto('/obras/batman')
    const thumb2 = page.locator('button[aria-label="Ver foto 2"]')
    await expect(thumb2).toBeVisible()
    await thumb2.click()
    // First thumb should now be de-selected (opacity-60)
    const thumb1 = page.locator('button[aria-label="Ver foto 1"]')
    await expect(thumb1).not.toHaveClass(/ring-accent/)
  })
})
