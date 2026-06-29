import { IsString, IsNotEmpty } from 'class-validator';

export class UserLogin {
    @IsString()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;
}