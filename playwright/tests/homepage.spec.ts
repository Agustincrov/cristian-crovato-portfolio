import { test, expect } from '@playwright/test'

const WA_NUMBER = '5493517064453'

test.describe('Homepage (/)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('hero section renders with correct content', async ({ page }) => {
    const h1 = page.locator('h1').first()
    await expect(h1).toContainText('Cristian')
    await expect(h1).toContainText('Crovato')
    await expect(page.locator('text=Bustos y esculturas de personajes')).toBeVisible()
  })

  test('hero CTAs link to correct pages', async ({ page }) => {
    // Target the hero section specifically to avoid nav links
    const hero = page.locator('section').first()
    await expect(hero.locator('a[href="/obras"]', { hasText: 'Ver obras' })).toBeVisible()
    await expect(hero.locator('a[href="/contacto"]', { hasText: 'Contacto' })).toBeVisible()
  })

  test('hero image loads', async ({ page }) => {
    const heroImg = page.locator('img[alt*="Cristian"], img[src*="heroes"]').first()
    await expect(heroImg).toBeVisible()
  })

  test('featured works section shows 6 cards', async ({ page }) => {
    const cards = page.locator('a[href^="/obras/"]')
    await expect(cards).toHaveCount(6)
  })

  test('featured work cards have title and price', async ({ page }) => {
    const firstCard = page.locator('a[href^="/obras/"]').first()
    await expect(firstCard.locator('h3')).toBeVisible()
    await expect(firstCard.locator('text=ARS')).toBeVisible()
  })

  test('"Ver todas/todo" link goes to /obras', async ({ page }) => {
    // Mobile shows "Ver todo →", desktop shows "Ver todas →"
    const verTodas = page.locator('a[href="/obras"]', { hasText: /ver tod/i }).first()
    await expect(verTodas).toBeVisible()
  })
})
