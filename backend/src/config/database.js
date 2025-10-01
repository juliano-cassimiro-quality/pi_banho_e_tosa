import dotenv from 'dotenv'
import pkg from 'pg'

const { Pool } = pkg

dotenv.config()

const connectionString = process.env.DATABASE_URL

export const pool = new Pool({
  connectionString,
    ssl: { rejectUnauthorized: false }
})

export async function query (text, params) {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  if (process.env.NODE_ENV !== 'test') {
    console.log('executed query', { text, duration, rows: res.rowCount })
  }
  return res
}
