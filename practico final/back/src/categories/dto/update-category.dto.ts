import { PartialType } from "@nestjs/mapped-types";
import { CreateCategoryInput } from "./create-category.dto";

export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {}