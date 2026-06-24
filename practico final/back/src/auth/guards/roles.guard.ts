import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRol } from "../types/user-role.enum";
import { ROLES_KEY } from "src/common/decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRol[] | undefined>(
            ROLES_KEY, [context.getHandler(), context.getClass()]
        );

        if (!requiredRoles?.length) return true;

        const request = context.switchToHttp().getRequest();
        const role = request.user?.role as UserRol | undefined;

        return !!role && requiredRoles.includes(role);
    }
}