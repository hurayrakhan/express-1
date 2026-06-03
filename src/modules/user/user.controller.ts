import type { Request, Response } from "express";
import { pool } from "../../db";


const createUser = async (req: Request, res: Response) => {
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
}


export const userController = {
    createUser,
}