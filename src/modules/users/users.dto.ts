export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    active?: boolean;
}

export interface ChangePasswordDTO {
    currentPassword: string;
    newPassword: string;
}
