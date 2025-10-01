import fs from 'fs'
import dotenv from 'dotenv'
import pkg from 'pg'

dotenv.config()
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Supabase exige SSL
})

async function init() {
  try {
    const schema = fs.readFileSync('schema.sql', 'utf-8')
    await pool.query(schema)
    console.log("✅ Banco de dados criado/atualizado com sucesso!")
  } catch (err) {
    console.error("❌ Erro ao criar banco:", err)
  } finally {
    await pool.end()
  }
}

init()
