import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductInput {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(256)
    name!: string;

    @IsNumber({ maxDecimalPlaces: 4 })
    @IsNotEmpty()
    @IsPositive()
    price!: number;

    @IsInt()
    @IsNotEmpty()
    @Min(0)
    @IsOptional()
    stock: number = 0;

    @IsInt()
    @IsOptional()
    categoryId?: number;
}