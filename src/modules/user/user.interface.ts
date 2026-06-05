export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    is_admin: boolean;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}