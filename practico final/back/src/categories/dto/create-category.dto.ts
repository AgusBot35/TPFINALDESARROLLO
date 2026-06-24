import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoryInput {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;
}