import { Pool } from "pg"
import config from "../config"

const pool = new Pool({
    connectionString: config.connectionString
})


const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(20) NOT NULL,
            is_admin BOOLEAN DEFAULT false,
            is_active BOOLEAN DEFAULT true,

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            )
            `)
    } catch (error) {
        console.log("Error initializing database: ", error)
    }
}


export { pool, initDB}