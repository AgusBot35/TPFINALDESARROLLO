import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangeEmailDto {
    @IsEmail()
    newEmail!: string

    @IsString()
    @IsNotEmpty()
    password!: string;
}