import { Repository } from "typeorm";
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { randomUUID } from "crypto";

import { UserRol } from "./types/user-role.enum";
import { Payload } from "./types/payload.type";
import { UserRegister } from "./dto/user-register.dto";
import { UserLogin } from "./dto/user-login.dto";
import { AuthResult } from "./dto/auth-result.dto";
import { UserEntity } from "../users/entities/user.entity";
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepo: Repository<UserEntity>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService
    ) {}

    async register(userRegister: UserRegister): Promise<{ user: { id: string; email: string; role: UserRol; createdAt: Date }, access_token: string }> {
        const exists = await this.usersRepo.findOne({
            where: { email: userRegister.email.trim().toLowerCase() }
        });

        if (exists) {
            throw new ConflictException('Email ya registrado');
        }

        const token = randomUUID();

        const cost = Number(this.configService.getOrThrow<string>('BCRYPT_COST') ?? '12');
        const passwordHash = await bcrypt.hash(userRegister.password, cost);

        const countUsers = await this.usersRepo.count();
        const role = countUsers === 0 ? UserRol.ADMIN : UserRol.USER;

        const user = this.usersRepo.create({
            email: userRegister.email,
            passwordHash,
            role
        });

        user.verificationToken = token;
        user.isVerified = false;
        const userSaved = await this.usersRepo.save(user);

        await this.mailService.sendVerificationEmail(
            user.email,
            token
        );

        return {
            user: {
                id: userSaved.id,
                email: userSaved.email,
                role: userSaved.role,
                createdAt: userSaved.createdAt
            },
            access_token: this.jwtService.sign({
                sub: userSaved.id,
                role: userSaved.role
            })
        };
    }

    async login(userLogin: UserLogin): Promise<{ user: { id: string; email: string; role: UserRol; createdAt: Date }, access_token: string }> {
        const email = userLogin.email.trim().toLowerCase();

        const user = await this.usersRepo.createQueryBuilder('user')
                                        .addSelect('user.passwordHash')
                                        .where('user.email = :email', { email })
                                        .getOne();
        
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        if (!user.isVerified) {
            throw new UnauthorizedException(
                'Debes verificar tu email'
            );
        }
        
        const ok = await bcrypt.compare(userLogin.password, user.passwordHash);
        if (!ok) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload: Payload = {
            sub: user.id,
            role: user.role
        };

        const access_token = this.jwtService.sign(payload);

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            },
            access_token: access_token
        };
    }

    async verifyEmail(token: string) {
        const user = await this.usersRepo.findOne({
            where: {
                verificationToken: token
            }
        });

        if (!user) {
            throw new BadRequestException(
                'Token inválido o expirado'
            );
        }

        user.isVerified = true;
        user.verificationToken = null;

        await this.usersRepo.save(user);

        return {
            message: 'Email verificado'
        };
    }

    async resendVerificationEmail(email: string) {
        const user = await this.usersRepo.findOne({
            where: {
                email: email.trim().toLowerCase()
            }
        });

        if (!user) {
            throw new BadRequestException('Email no registrado');
        }

        if (user.isVerified) {
            return ('Email ya verificado');
        }

        const token = randomUUID();
        user.verificationToken = token;

        await this.usersRepo.save(user);

        await this.mailService.sendVerificationEmail(
            user.email,
            token
        );

        return {
            message: 'Correo de verificación reenviado'
        };
    }

    async me(userId: string) {
        const user = await this.usersRepo.findOne({
            where: { id: userId }
        });
        const user_logged = {
            id: user?.id,
            email: user?.email,
            role: user?.role,
            isVerified: user?.isVerified,
            createdAt: user?.createdAt,
        };
        return user_logged;
    }

    async forgotPassword(email: string) {
        const user = await this.usersRepo.findOne({
            where: {
                email: email.trim().toLowerCase()
            }
        });
        
        if (!user) {
            throw new BadRequestException('Email no registrado');
        }

        const token = randomUUID();
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        await this.usersRepo.save(user);

        await this.mailService.sendForgotPasswordEmail(
            user.email,
            token
        );

        return {
            message: 'Correo de recuperación de contraseña enviado'
        };

    }

    async resendForgotPasswordEmail(email: string) {
        const user = await this.usersRepo.findOne({
            where: {
                email: email.trim().toLowerCase()
            }
        });
        if (!user) {
            throw new BadRequestException('Email no registrado');
        }
        const token = randomUUID();
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        await this.usersRepo.save(user);

        await this.mailService.sendForgotPasswordEmail(
            user.email,
            token
        );

        return {
            message: 'Correo de recuperación de contraseña reenviado'
        };
    }

    async resetPassword(token: string, password: string) {
        const user = await this.usersRepo.findOne({
            where: {
                resetPasswordToken: token
            }
        });

        if (!user) {
            throw new BadRequestException('Token de recuperación de contraseña invalido');
        }

        const cost = Number(this.configService.getOrThrow<string>('BCRYPT_COST') ?? '12');
        const passwordHash = await bcrypt.hash(password, cost);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        user.passwordHash = passwordHash;

        await this.usersRepo.save(user);

        return {
            message: 'Contraseña actualizada'
        };
    }
}
