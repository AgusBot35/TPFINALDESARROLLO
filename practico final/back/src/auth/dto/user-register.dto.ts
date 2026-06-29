import { IsString, IsNotEmpty } from 'class-validator';

export type UserRegister = {
    @IsString()
    @IsNotEmpty()
    email: string;
    password: string;
};