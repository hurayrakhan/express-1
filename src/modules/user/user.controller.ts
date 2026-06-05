import type { Request, Response } from "express";
import { userService } from "./user.service";


const createUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.createUser(req.body);
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