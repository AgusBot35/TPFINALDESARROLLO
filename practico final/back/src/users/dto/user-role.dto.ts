import { IsIn } from "class-validator";
import { UserRol } from "src/auth/types/user-role.enum";

export class UserRoleDto {
    @IsIn([UserRol.ADMIN, UserRol.USER])
    role!:  UserRol;
}