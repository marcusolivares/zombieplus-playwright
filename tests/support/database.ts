import 'dotenv/config'
import { Pool, QueryResult } from 'pg'

interface DbConfig {
  user: string
  host: string
  database: string
  password: string
  port: number
}

const DbConfig: DbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'zombieplus',
  password: process.env.DB_PASSWORD || 'pwd123',
  port: parseInt(process.env.DB_PORT || '5432', 10)
}

export async function executeSQL(sqlScript: string): Promise<void> {
  const pool = new Pool(DbConfig)
  try {
    const client = await pool.connect()
    const result: QueryResult = await client.query(sqlScript)
    // console.log(result.rows)
    client.release()
  } catch (error) {
    console.error('Error executing SQL:', error)
  } finally {
    await pool.end()
  }
}
