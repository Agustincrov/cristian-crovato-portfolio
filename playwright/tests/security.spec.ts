import { test, expect } from '@playwright/test'

const PAGES = ['/', '/obras', '/obras/batman', '/sobre-mi', '/clientes', '/contacto']

const REQUIRED_HEADERS = [
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
]

const SECURE_HEADER_VALUES: Record<string, RegExp> = {
  'x-content-type-options': /nosniff/i,
  'x-frame-options': /deny|sameorigin/i,
  'referrer-policy': /no-referrer|strict-origin/i,
  'strict-transport-security': /max-age=\d+/i,
  'content-security-policy': /.+/,
  'permissions-policy': /.+/,
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function isMixedContent(url: string, pageUrl: string): boolean {
  return pageUrl.startsWith('https://') && url.startsWith('http://')
}

// ── Tests ────────────────────────────────────────────────────────────────────

test.describe('Security audit', () => {
  for (const path of PAGES) {
    test.describe(`Page: ${path}`, () => {
      test('HTTP security headers', async ({ page, request }) => {
        const response = await request.get(
          (process.env.BASE_URL ?? 'http://localhost:3001') + path,
        )
        const headers = response.headers()

        const missing: string[] = []
        const wrong: string[] = []
        const present: string[] = []

        for (const header of REQUIRED_HEADERS) {
          if (!headers[header]) {
            missing.push(header)
          } else {
            present.push(`${header}: ${headers[header]}`)
          }
        }

        // Check value correctness for headers that are present
        for (const [header, pattern] of Object.entries(SECURE_HEADER_VALUES)) {
          if (headers[header] && !pattern.test(headers[header])) {
            wrong.push(`${header}: ${headers[header]}`)
          }
        }

        // Report informational (non-required but desirable) headers
        const informational = ['content-security-policy', 'permissions-policy', 'strict-transport-security']
        const missing_info = informational.filter(h => !headers[h])
        if (missing_info.length > 0) {
          console.log(`[INFO] Missing recommended headers on ${path}: ${missing_info.join(', ')}`)
        }
        if (present.length > 0) {
          console.log(`[OK] Present headers on ${path}:\n  ${present.join('\n  ')}`)
        }

        expect(missing, `Missing required headers on ${path}: ${missing.join(', ')}`).toHaveLength(0)
        expect(wrong, `Headers with insecure values on ${path}: ${wrong.join(', ')}`).toHaveLength(0)
      })

      test('No mixed content (HTTP resources on HTTPS page)', async ({ page }) => {
        const mixedContent: string[] = []
        const pageUrl = (process.env.BASE_URL ?? 'http://localhost:3001') + path

        page.on('request', req => {
          if (isMixedContent(req.url(), pageUrl)) {
            mixedContent.push(req.url())
          }
        })

        await page.goto(pageUrl, { waitUntil: 'networkidle' })

        if (mixedContent.length > 0) {
          console.log(`[FAIL] Mixed content on ${path}:\n  ${mixedContent.join('\n  ')}`)
        }

        expect(mixedContent, `Mixed content detected on ${path}`).toHaveLength(0)
      })

      test('No security-related console errors', async ({ page }) => {
        const securityMessages: string[] = []

        page.on('console', msg => {
          const text = msg.text()
          const lower = text.toLowerCase()
          if (
            msg.type() === 'error' ||
            lower.includes('content security policy') ||
            lower.includes('mixed content') ||
            lower.includes('insecure') ||
            lower.includes('blocked') ||
            lower.includes('cors')
          ) {
            securityMessages.push(`[${msg.type()}] ${text}`)
          }
        })

        await page.goto(
          (process.env.BASE_URL ?? 'http://localhost:3001') + path,
          { waitUntil: 'networkidle' },
        )

        if (securityMessages.length > 0) {
          console.log(`[FAIL] Security console messages on ${path}:\n  ${securityMessages.join('\n  ')}`)
        }

        expect(securityMessages, `Security console errors on ${path}`).toHaveLength(0)
      })

      test('No 5xx server errors on page resources', async ({ page }) => {
        const serverErrors: string[] = []

        page.on('response', res => {
          if (res.status() >= 500) {
            serverErrors.push(`${res.status()} ${res.url()}`)
          }
        })

        await page.goto(
          (process.env.BASE_URL ?? 'http://localhost:3001') + path,
          { waitUntil: 'networkidle' },
        )

        expect(serverErrors, `Server errors on ${path}: ${serverErrors.join(', ')}`).toHaveLength(0)
      })
    })
  }

  // ── CDP-based checks (Chrome only) ────────────────────────────────────────

  test.describe('Chrome DevTools — cookie security', () => {
    test('All cookies are Secure + HttpOnly + SameSite', async ({ page, context, browserName }) => {
      test.skip(browserName !== 'chromium', 'CDP only available on Chromium')

      await page.goto(process.env.BASE_URL ?? 'http://localhost:3001', {
        waitUntil: 'networkidle',
      })

      const cookies = await context.cookies()
      const problems: string[] = []

      for (const cookie of cookies) {
        const issues: string[] = []
        if (!cookie.httpOnly) issues.push('missing HttpOnly')
        if (!cookie.secure && (process.env.BASE_URL ?? '').startsWith('https'))
          issues.push('missing Secure flag')
        if (!cookie.sameSite || cookie.sameSite === 'None')
          issues.push(`SameSite=${cookie.sameSite ?? 'unset'}`)

        if (issues.length > 0) {
          problems.push(`${cookie.name}: ${issues.join(', ')}`)
        }
      }

      if (cookies.length === 0) {
        console.log('[INFO] No cookies found — nothing to audit.')
      }

      if (problems.length > 0) {
        console.log(`[FAIL] Cookie security issues:\n  ${problems.join('\n  ')}`)
      }

      expect(problems, `Insecure cookies: ${problems.join(' | ')}`).toHaveLength(0)
    })

    test('No failed resource requests (4xx on own domain)', async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'CDP only available on Chromium')

      const baseHost = new URL(process.env.BASE_URL ?? 'http://localhost:3001').host
      const failed: string[] = []

      page.on('response', res => {
        const resHost = new URL(res.url()).host
        if (resHost === baseHost && res.status() >= 400 && res.status() < 500) {
          failed.push(`${res.status()} ${res.url()}`)
        }
      })

      for (const path of PAGES) {
        await page.goto(
          (process.env.BASE_URL ?? 'http://localhost:3001') + path,
          { waitUntil: 'networkidle' },
        )
      }

      if (failed.length > 0) {
        console.log(`[FAIL] Client errors on own domain:\n  ${failed.join('\n  ')}`)
      }

      expect(failed, `4xx on own domain: ${failed.join(', ')}`).toHaveLength(0)
    })

    test('CDP — security state is "secure" or acceptable', async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'CDP only available on Chromium')

      const baseURL = process.env.BASE_URL ?? 'http://localhost:3001'

      // Skip TLS check for local HTTP dev
      if (baseURL.startsWith('http://')) {
        console.log('[SKIP] Local HTTP — TLS security state check skipped.')
        return
      }

      const cdpSession = await page.context().newCDPSession(page)
      await cdpSession.send('Security.enable')

      await page.goto(baseURL, { waitUntil: 'networkidle' })

      const state = await cdpSession.send('Security.getSecurityState' as any)
      console.log('[CDP] Security state:', JSON.stringify(state, null, 2))

      expect(
        ['secure', 'neutral'],
        `Unexpected security state: ${JSON.stringify(state)}`,
      ).toContain((state as any).securityState)

      await cdpSession.detach()
    })
  })
})
