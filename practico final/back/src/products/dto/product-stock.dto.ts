import { IsInt, IsPositive } from "class-validator";

export class ProductStockDto {
    @IsInt()
    @IsPositive()
    quantity: number;
}