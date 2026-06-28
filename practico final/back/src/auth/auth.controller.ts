import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { UserRegister } from "./dto/user-register.dto";
import { UserLogin } from "./dto/user-login.dto";
import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

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

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@Request() req: any) {
        return this.authService.me(req.user.id);
    }

    @Post('verify-email')
    verifyEmail(@Body() dto: VerifyEmailDto) {
        return this.authService.verifyEmail(dto.token);
    }

    @Post('resend-verification-email')
    async resendVerificationEmail(@Body() { email }: { email: string }) {
        return this.authService.resendVerificationEmail(email);
    }
}
