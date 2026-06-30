import authTools from "./auth";
import type { ToolDef } from "../tool-factory";
import productsTools from "./products";
import categoriesTools from "./categories";
import usersTools from "./users";

export default [
  ...authTools,
  ...productsTools,
  ...categoriesTools,
  ...usersTools
] as ToolDef[];
