const { drizzle } = require('drizzle-orm/node-postgres')
const { Pool } = require('pg')

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Add Neon connection string in Vercel environment variables.')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

const db = drizzle(pool)

module.exports = { db, pool }
