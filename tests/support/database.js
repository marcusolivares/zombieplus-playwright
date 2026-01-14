require('dotenv').config()

const {Pool} = require('pg')

const DbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
}

async function executeSQL(sqlScript) {
    const pool = new Pool(DbConfig)
    try {
        const client = await pool.connect()
        const result = await client.query(sqlScript)
        // console.log(result.rows)
        client.release()
    } catch (error) {
        console.error('Error executing SQL:', error)
    } finally {
        await pool.end()
    }
}

module.exports = { executeSQL }
