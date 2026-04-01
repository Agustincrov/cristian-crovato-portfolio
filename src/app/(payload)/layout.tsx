import '@payloadcms/next/css'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap.js'
import type React from 'react'

type Args = {
  children: React.ReactNode
}

export default async function Layout({ children }: Args) {
  async function serverFunction(args: Parameters<typeof handleServerFunctions>[0]) {
    'use server'
    return handleServerFunctions({
      ...args,
      config: import('@payload-config').then(m => m.default),
      importMap,
    })
  }

  return (
    <RootLayout
      config={import('@payload-config').then(m => m.default)}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  )
}
