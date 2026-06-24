import { UserRol } from "../types/user-role.enum";

export type AuthResult = {
    id: string;
    email: string;
    role: UserRol;
};