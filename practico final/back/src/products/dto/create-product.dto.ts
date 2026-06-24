import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductInput {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    price: number;

    @IsInt()
    @IsNotEmpty()
    @Min(0)
    stock: number;

    @IsInt()
    @IsOptional()
    categoryId?: number;
}