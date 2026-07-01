import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request, UseGuards } from "@nestjs/common";

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

    @Post('verify-email')
        verifyEmail(@Body() dto: VerifyEmailDto) {
        return this.authService.verifyEmail(dto.token);
    }

    @Post('resend-verification')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async resendVerificationEmail(@Request() request: any) {
        return this.authService.resendVerificationEmail(request.user.email);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@Request() request: any) {
        return this.authService.me(request.user.sub);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() { email }: { email: string }) {
        return this.authService.forgotPassword(email);
    }

    @Post('resend-forgot-password-email')
    async resendForgotPasswordEmail(@Body() { email }: { email: string }) {
        return this.authService.resendForgotPasswordEmail(email);
    }

    @Post('reset-password')
    async resetPassword(@Body() { token, password }: { token: string; password: string }, @Request() request: any) {
        return this.authService.resetPassword(token, password);
    }

}