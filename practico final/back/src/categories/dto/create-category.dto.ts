import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryInput {
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(128)
    name!: string;
}