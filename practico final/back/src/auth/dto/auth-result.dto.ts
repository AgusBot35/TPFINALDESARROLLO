import { UserRol } from "../types/user-role.enum";

export type SafeUser = {
    id: string;
    email: string;
    role: UserRol;
    isVerified: boolean;
    createdAt: Date;
};

export type AuthResult = {
    id: string;
    email: string;
    role: UserRol;
};

export type LoginResult = {
    user: SafeUser;
    access_token: string;
};
