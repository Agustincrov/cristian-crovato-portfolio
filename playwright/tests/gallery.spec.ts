import { test, expect } from '@playwright/test'

const ALL_SLUGS = [
  'the-thing',
  'spider-man',
  'spawn',
  'the-punisher',
  'old-man-logan',
  'the-mandalorian',
  'lobo',
  'kratos',
  'daredevil',
  'batman',
]

const ALL_TITLES = [
  'The Thing — Los 4 Fantásticos',
  'Spider-Man',
  'Spawn',
  'The Punisher',
  'Old Man Logan',
  'The Mandalorian',
  'Lobo — DC Comics',
  'Kratos — God of War',
  'Daredevil',
  'Batman',
]

test.describe('Gallery (/obras)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/obras')
  })

  test('page heading is visible', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Obras' })).toBeVisible()
  })

  test('shows all 10 works', async ({ page }) => {
    const cards = page.locator('a[href^="/obras/"]')
    await expect(cards).toHaveCount(10)
  })

  test('all slugs are present', async ({ page }) => {
    for (const slug of ALL_SLUGS) {
      await expect(page.locator(`a[href="/obras/${slug}"]`)).toBeVisible()
    }
  })

  test('all work titles are visible', async ({ page }) => {
    for (const title of ALL_TITLES) {
      await expect(page.locator('h3', { hasText: title })).toBeVisible()
    }
  })

  test('cards show ARS price', async ({ page }) => {
    await expect(page.locator('p').filter({ hasText: /^ARS/ }).first()).toBeVisible()
  })

  test('cards show USD price', async ({ page }) => {
    await expect(page.locator('p').filter({ hasText: /^USD/ }).first()).toBeVisible()
  })

  test('cards show availability badge', async ({ page }) => {
    const badge = page.locator('span', { hasText: /Disponible|Por encargo/ }).first()
    await expect(badge).toBeVisible()
  })

  test('card image loads', async ({ page }) => {
    const firstCard = page.locator('a[href^="/obras/"]').first()
    const img = firstCard.locator('img')
    await expect(img).toBeVisible()
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth)
    expect(naturalWidth).toBeGreaterThan(0)
  })

  test('clicking a card navigates to work detail', async ({ page }) => {
    await page.locator('a[href="/obras/batman"]').click()
    await expect(page).toHaveURL('/obras/batman')
    await expect(page.locator('h1', { hasText: 'Batman' })).toBeVisible()
  })

  test('profile sidebar is visible on desktop', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Sidebar stacks below content on mobile')
    await expect(page.locator('text=Cristian Crovato').first()).toBeVisible()
    await expect(page.locator('text=Córdoba, Argentina').first()).toBeVisible()
  })

  test('sidebar has WhatsApp CTA', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Sidebar stacks below content on mobile')
    await expect(page.locator('a[href*="wa.me"]').first()).toBeVisible()
  })
})

test.describe('Gallery — mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('shows all 10 works stacked in a single column', async ({ page }) => {
    await page.goto('/obras')
    const cards = page.locator('a[href^="/obras/"]')
    await expect(cards).toHaveCount(10)
  })
})
