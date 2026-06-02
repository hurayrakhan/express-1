import express, { type Application, type Request, type Response } from 'express';
import { Pool } from 'pg';

const app : Application = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

// database connection
const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_KgQ4Za6vrSsk@ep-falling-tooth-ao0waccg-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
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
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `)
    } catch (error) {
        console.log("Error initializing database: ", error)
    }
}


app.get("/", (req : Request, res : Response) => {
    // res.send("Hello World")
    res.status(200).json({
        "message": "Express server is running successfully!"
    })
})

app.post("/user", (req : Request , res : Response) => {
    
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


