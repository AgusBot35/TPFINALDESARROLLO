import { IsString, IsNotEmpty } from 'class-validator';

export class UserRegister {
    @IsString()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;
}