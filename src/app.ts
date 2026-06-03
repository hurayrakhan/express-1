import express, { type Application, type Request, type Response } from 'express';
import { initDB } from './db';
import { pool } from './db';
import { userRoute } from './modules/user/user.router';

const app : Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

initDB();


app.get("/", (req : Request, res : Response) => {
    // res.send("Hello World")
    res.status(200).json({
        "message": "Express server is running successfully!"
    })
})

app.use("/api/user", userRoute);

app.get("/users" , async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT * FROM users
            `);
        res.status(200).json({
            success: true,
            message: "Users Retrieved successfully!",
            users: result.rows,
        });
    } catch (error : any) {
        console.error("Error fetching users: ", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Internal Server Error",
            error: error ,
        });
    }
});


app.get("/users/:id", async (req: Request, res: Response ) => {
    const { id } = req.params;
    try {
    const result = await pool.query(`
        SELECT * FROM users WHERE id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
                user: null
            })
        }
        res.status(200).json({
            success: true,
            message: "User retrieved successfully!",
            user: result.rows[0]
        })
    } catch (error :any) {
        console.error("Error fetching user: ", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
            error: error,
        })
    }
})

app.delete("/users/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            DELETE FROM users WHERE id = $1 RETURNING *
        `, [id]);

       if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
                user: null
            })
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully!",

        })
    } catch (error : any) {
        console.error("Error deleting user: ", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
            error: error,
        })
    }
});

app.put("/users/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, password, is_admin, is_active } = req.body;
    try {
        const result = await pool.query(`
            UPDATE users
            SET
            name = COALESCE($1, name),
            email = COALESCE($2, email),
            password = COALESCE($3, password),
            is_admin = COALESCE($4, is_admin),
            is_active = COALESCE($5, is_active)
            WHERE id = $6
            RETURNING *
        `, [name, email, password, is_admin, is_active, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
                user: null
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully!",
            user: result.rows[0]
        });
    } catch (error : any) {
        console.error("Error updating user: ", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
            error: error,
        });
    }
});


export default app;

