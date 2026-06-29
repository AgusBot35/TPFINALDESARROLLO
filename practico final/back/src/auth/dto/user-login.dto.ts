import { IsString, IsNotEmpty } from 'class-validator';

export type UserLogin = {
    @IsString()
    @IsNotEmpty()
    email: string;
    password: string;
};