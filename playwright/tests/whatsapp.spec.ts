import { test, expect } from '@playwright/test'

const WA_NUMBER = '5493517064453'
const WA_BASE = `https://wa.me/${WA_NUMBER}`
const GENERIC_MSG = 'Hola%20Cristian%2C%20me%20gustar%C3%ADa%20hacer%20una%20consulta'

test.describe('WhatsApp integration', () => {
  test('navbar Consultar links to WhatsApp with generic message', async ({ page }) => {
    await page.goto('/')
    const consultar = page.locator('nav a', { hasText: 'Consultar' }).first()
    const href = await consultar.getAttribute('href')
    expect(href).toContain(WA_NUMBER)
    expect(href).toContain('Hola')
    await expect(consultar).toHaveAttribute('target', '_blank')
  })

  test('/contacto Escribir por WhatsApp has correct number', async ({ page }) => {
    await page.goto('/contacto')
    const btn = page.locator(`a[href*="${WA_NUMBER}"]`, { hasText: /escribir por whatsapp/i })
    await expect(btn).toBeVisible()
    const href = await btn.getAttribute('href')
    expect(href).toContain(WA_NUMBER)
    await expect(btn).toHaveAttribute('target', '_blank')
  })

  test('work detail WA message includes sculpture title — Batman', async ({ page }) => {
    await page.goto('/obras/batman')
    const waBtn = page.locator(`a[href*="${WA_NUMBER}"]`, { hasText: /consultar por esta obra/i })
    const href = await waBtn.getAttribute('href')
    expect(href).toContain(WA_NUMBER)
    expect(href).toContain('Batman')
    expect(href).toContain('me%20interesa%20la%20escultura')
  })

  test('work detail WA message includes sculpture title — Daredevil', async ({ page }) => {
    await page.goto('/obras/daredevil')
    const waBtn = page.locator(`a[href*="${WA_NUMBER}"]`, { hasText: /consultar por esta obra/i })
    const href = await waBtn.getAttribute('href')
    expect(href).toContain('Daredevil')
  })

  test('work detail WA message includes sculpture title — Kratos', async ({ page }) => {
    await page.goto('/obras/kratos')
    const waBtn = page.locator(`a[href*="${WA_NUMBER}"]`, { hasText: /consultar por esta obra/i })
    const href = await waBtn.getAttribute('href')
    expect(href).toContain('Kratos')
  })

  test('all WA links open in new tab with noopener', async ({ page }) => {
    await page.goto('/obras/batman')
    const waLinks = page.locator(`a[href*="${WA_NUMBER}"]`)
    const count = await waLinks.count()
    for (let i = 0; i < count; i++) {
      await expect(waLinks.nth(i)).toHaveAttribute('target', '_blank')
      await expect(waLinks.nth(i)).toHaveAttribute('rel', /noopener/)
    }
  })

  test('/sobre-mi CTA links to WhatsApp', async ({ page }) => {
    await page.goto('/sobre-mi', { waitUntil: 'domcontentloaded' })
    // Just assert the link exists in the DOM — CTA is at bottom, may be off-screen
    const consultar = page.locator(`a[href*="${WA_NUMBER}"]`).first()
    await expect(consultar).toHaveAttribute('href', new RegExp(WA_NUMBER))
  })
})
