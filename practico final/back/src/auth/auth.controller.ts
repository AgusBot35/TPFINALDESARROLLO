import { Body, Controller, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { UserRegister } from "./dto/user-register.dto";
import { UserLogin } from "./dto/user-login.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('register')
    async register(@Body() body: UserRegister) {
        return this.authService.register(body);
    }

    @Post('login')
    async login(@Body() body: UserLogin) {
        return this.authService.login(body);
    }
}