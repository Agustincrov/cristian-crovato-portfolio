import { test, expect } from '@playwright/test'

const WA_NUMBER = '5493517064453'

const NAV_LINKS = [
  { text: 'Obras', href: '/obras' },
  { text: 'Sobre mí', href: '/sobre-mi' },
  { text: 'Clientes', href: '/clientes' },
  { text: 'Contacto', href: '/contacto' },
]

const FOOTER_LINKS = [
  { text: 'Obras', href: '/obras' },
  { text: 'Sobre mí', href: '/sobre-mi' },
  { text: 'Clientes', href: '/clientes' },
  { text: 'Contacto', href: '/contacto' },
]

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('logo links to homepage', async ({ page }) => {
    const logo = page.locator('nav a[href="/"]').first()
    await expect(logo).toBeVisible()
    await expect(logo).toContainText('Cristian Crovato')
  })

  test('desktop nav contains all section links', async ({ page }) => {
    for (const { text, href } of NAV_LINKS) {
      const link = page.locator('nav a', { hasText: text }).first()
      await expect(link).toHaveAttribute('href', href)
    }
  })

  test('navbar Consultar button links to WhatsApp', async ({ page }) => {
    const consultar = page.locator('nav a', { hasText: 'Consultar' }).first()
    await expect(consultar).toHaveAttribute('href', new RegExp(WA_NUMBER))
    await expect(consultar).toHaveAttribute('target', '_blank')
  })

  test('footer contains all nav links', async ({ page }) => {
    const footer = page.locator('footer')
    for (const { text, href } of FOOTER_LINKS) {
      await expect(footer.locator(`a[href="${href}"]`, { hasText: text })).toBeVisible()
    }
  })

  test('footer WhatsApp link has correct number', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer.locator(`a[href*="${WA_NUMBER}"]`)).toBeVisible()
  })

  test('footer Instagram link is correct', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer.locator('a[href*="instagram.com/cristiancrovato"]')).toBeVisible()
  })

  test('footer shows sculptor tagline', async ({ page }) => {
    await expect(page.locator('footer')).toContainText('Escultor')
    await expect(page.locator('footer')).toContainText('Córdoba, Argentina')
  })
})

test.describe('Navigation — mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('hamburger button is visible on mobile', async ({ page }) => {
    const hamburger = page.locator('button[aria-label*="enú"], button[aria-label*="enu"]').first()
    await expect(hamburger).toBeVisible()
  })

  test('mobile menu opens and shows nav links', async ({ page }) => {
    const hamburger = page.locator('button[aria-label="Menú"]')
    await expect(hamburger).toBeVisible()

    // Dropdown is conditionally rendered — not in DOM before click
    await expect(page.locator('header a[href="/obras"]').last()).not.toBeVisible()
    await hamburger.click()

    // After click, dropdown renders inside header with all nav links
    for (const { text, href } of NAV_LINKS) {
      await expect(page.locator('header a', { hasText: text }).last()).toBeVisible()
    }
  })
})
