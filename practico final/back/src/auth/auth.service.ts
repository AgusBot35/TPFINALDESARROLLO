import { Repository } from "typeorm";
import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

import { UserRol } from "./types/user-role.enum";
import { Payload } from "./types/payload.type";
import { UserRegister } from "./dto/user-register.dto";
import { UserLogin } from "./dto/user-login.dto";
import { AuthResult } from "./dto/auth-result.dto";
import { UserEntity } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepo: Repository<UserEntity>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {}

    async register(userRegister: UserRegister): Promise<AuthResult> {
        const exists = await this.usersRepo.findOne({
            where: { email: userRegister.email.trim().toLowerCase() }
        });

        if (exists) {
            throw new ConflictException('Email ya registrado');
        }

        const cost = Number(this.configService.getOrThrow<string>('BCRYPT_COST') ?? '12');
        const passwordHash = await bcrypt.hash(userRegister.password, cost);

        const countUsers = await this.usersRepo.count();
        const role = countUsers === 0 ? UserRol.ADMIN : UserRol.USER;

        const user = this.usersRepo.create({
            email: userRegister.email,
            passwordHash,
            role
        });

        const userSaved = await this.usersRepo.save(user);
        return {
            id: userSaved.id,
            email: userSaved.email,
            role: userSaved.role
        };
    }

    async login(userLogin: UserLogin): Promise<{ access_token: string }> {
        const email = userLogin.email.trim().toLowerCase();

        const user = await this.usersRepo.createQueryBuilder('user')
                                        .addSelect('user.passwordHash')
                                        .where('user.email = :email', { email })
                                        .getOne();
        
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
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

        return { access_token };
    }
}