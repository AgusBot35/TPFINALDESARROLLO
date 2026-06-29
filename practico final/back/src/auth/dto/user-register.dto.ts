import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class UserRegister {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    password!: string;
}