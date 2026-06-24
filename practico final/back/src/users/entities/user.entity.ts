import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { UserRol } from "../../auth/types/user-role.enum";

@Entity('users_auth')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ select: false, name: 'password_hash' })
    passwordHash!: string;

    @Column({ type: 'boolean', default: false, name: 'is_verified' })
    isVerified!: boolean;

    @Column({ type: 'text', nullable: true, name: 'verification_token' })
    verificationToken!: string | null;

    @Column({ type: 'text', default: UserRol.USER })
    role!: UserRol;
}