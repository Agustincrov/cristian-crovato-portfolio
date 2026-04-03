// Runs schema migration at container startup before node server.js.
// Uses pg directly — no Payload CLI or tsx needed.
// Idempotent: skips if payload_migrations table already exists.
import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { Client } = pg
const __dirname = dirname(fileURLToPath(import.meta.url))

const client = new Client({ connectionString: process.env.DATABASE_URI })

async function run() {
  await client.connect()

  const { rows } = await client.query(`
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'payload_migrations'
  `)

  if (rows.length > 0) {
    console.log('[migrate] Schema already exists, skipping.')
    await client.end()
    return
  }

  console.log('[migrate] Running initial schema migration...')
  const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf8')
  await client.query(sql)

  // Mark the migration as applied so Payload's migration system knows
  await client.query(`
    INSERT INTO payload_migrations (name, batch, updated_at, created_at)
    VALUES ('initial_schema', 1, NOW(), NOW())
  `)

  console.log('[migrate] Schema migration complete.')
  await client.end()
}

run().catch(err => {
  console.error('[migrate] Migration failed:', err.message)
  process.exit(1)
})
