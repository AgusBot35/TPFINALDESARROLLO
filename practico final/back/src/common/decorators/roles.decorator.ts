import { SetMetadata } from "@nestjs/common";

import { UserRol } from "../../auth/types/user-role.enum";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRol[]) => SetMetadata(ROLES_KEY, roles);