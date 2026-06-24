import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { Payload } from "../types/payload.type";
import { UserEntity } from "../../users/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly configService: ConfigService,

        @InjectRepository(UserEntity)
        private readonly usersRepo: Repository<UserEntity>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET')
        })
    }

    async validate(payload: Payload) {
        const user = await this.usersRepo.findOne({
            where: { id: payload.sub }
        });

        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado.');
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role
        };
    }
}