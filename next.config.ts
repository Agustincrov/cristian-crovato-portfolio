import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // HSTS — only meaningful on HTTPS (Railway/Cloudflare). Ignored on HTTP dev.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js inline scripts (style + script chunks) need unsafe-inline/unsafe-eval in dev
      // In production Railway serves via Cloudflare which can add nonces — keep permissive for now
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      // WhatsApp redirect + Meta Pixel
      "connect-src 'self' https://www.facebook.com https://connect.facebook.net",
      "frame-src https://www.facebook.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    // Local storage — no external domains needed
    localPatterns: [
      { pathname: '/api/media/file/**' },
      { pathname: '/newphoto*.jpeg' },
      { pathname: '/cristian-profile.jpg' },
      { pathname: '/articulo-*.jpg' },
      { pathname: '/proceso-*.jpg' },
      { pathname: '/client-*.jpg' },
    ],
  },
}

export default withPayload(nextConfig)
