import { pool } from "../../db";
import type { User } from "./user.interface";

const createUser = async (payload: User) => {
    const { name, email, password, is_admin, is_active } = payload;
    const result = await pool.query(`
        INSERT INTO users (name, email, password, is_admin, is_active)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [name, email, password, is_admin, is_active]);
    return result.rows[0];
};

export const userService = {
    createUser,
}