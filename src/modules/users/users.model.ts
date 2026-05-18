export interface UserModel {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    active: boolean;
    created_at: Date;
}