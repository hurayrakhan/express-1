import express, { type Application, type Request, type Response } from 'express';
import { Pool } from 'pg';
import config from './config';

const app : Application = express();
const PORT = config.port || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

// database connection
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

initDB();


app.get("/", (req : Request, res : Response) => {
    // res.send("Hello World")
    res.status(200).json({
        "message": "Express server is running successfully!"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


app.post('/user', async (req: Request, res: Response) => {
    const { name, email, password, is_admin, is_active} = req.body;
    try {
        const result = await pool.query(`
            INSERT INTO users (name, email, password, is_admin, is_active)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [name, email, password, is_admin, is_active]);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: result.rows[0],
        });
    } catch (error: any) {
        console.error("Error creating user: ", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Internal Server Error",
            error: error ,
        });
    }
})