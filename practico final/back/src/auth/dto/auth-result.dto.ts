import { UserRol } from "../types/user-role.enum";

export type AuthResult = {
    sub: string;
    email: string;
    role: UserRol;
};