import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "categories_list",
    description: "Lista todas las categorías con filtros opcionales",
    inputSchema: {
      name: z.string().optional(),
      order: z.enum(["asc", "desc"]).optional(),
      page: z.number().int().positive().optional(),
      limit: z.number().int().positive().max(50).optional(),
    },
    handler: async (args: any) => {
      const params = new URLSearchParams();
      if (args.name) params.set("name", args.name);
      if (args.order) params.set("order", args.order);
      if (args.page) params.set("page", String(args.page));
      if (args.limit) params.set("limit", String(args.limit));
      return api.get(`/categories?${params}`);
    },
  },
  {
    name: "categories_get",
    description: "Obtiene una categoría por ID",
    inputSchema: { id: z.number().int().positive() },
    handler: async ({ id }: any) => api.get(`/categories/${id}`),
  },
  {
    name: "categories_get_products",
    description: "Lista los productos de una categoría",
    inputSchema: { id: z.number().int().positive() },
    handler: async ({ id }: any) => api.get(`/categories/${id}/products`),
  },
  {
    name: "categories_create",
    description: "Crea una nueva categoría (requiere rol admin)",
    inputSchema: { name: z.string().min(1).max(100) },
    handler: async (body: any) => api.post("/categories", body),
  },
  {
    name: "categories_delete",
    description: "Elimina una categoría (requiere rol admin, no puede tener productos)",
    inputSchema: { id: z.number().int().positive() },
    handler: async ({ id }: any) => api.del(`/categories/${id}`),
  },
] as ToolDef[];
