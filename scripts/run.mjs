// Compiles a TypeScript script with esbuild (no tsx, avoiding undici/Node 20 conflict)
// then runs it. Usage: node scripts/run.mjs scripts/seed.ts
import { build } from 'esbuild'
import { pathToFileURL } from 'url'
import path from 'path'

const target = process.argv[2]
if (!target) { console.error('Usage: node scripts/run.mjs <script.ts>'); process.exit(1) }

const outfile = target.replace(/\.ts$/, '.mjs')

await build({
  entryPoints: [target],
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  alias: { '@payload-config': './src/payload.config.ts' },
  outfile,
})

await import(pathToFileURL(path.resolve(outfile)).href)
