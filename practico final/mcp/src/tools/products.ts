import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "products_list",
    description: "Lista productos con filtros opcionales de nombre, orden y paginación",
    inputSchema: {
      name: z.string().optional(),
      orderBy: z.enum(["id", "name", "price", "stock"]).optional(),
      order: z.enum(["asc", "desc"]).optional(),
      page: z.number().int().positive().optional(),
      limit: z.number().int().positive().max(50).optional(),
    },
    handler: async (args: any) => {
      const params = new URLSearchParams();
      if (args.name) params.set("name", args.name);
      if (args.orderBy) params.set("orderBy", args.orderBy);
      if (args.order) params.set("order", args.order);
      if (args.page) params.set("page", String(args.page));
      if (args.limit) params.set("limit", String(args.limit));
      return api.get(`/products?${params}`);
    },
  },
  {
    name: "products_get",
    description: "Obtiene un producto por ID",
    inputSchema: { id: z.number().int().positive() },
    handler: async ({ id }: any) => api.get(`/products/${id}`),
  },
  {
    name: "products_create",
    description: "Crea un nuevo producto (requiere rol admin)",
    inputSchema: {
      name: z.string().min(2).max(100),
      price: z.number().positive(),
      stock: z.number().int().min(0).optional(),
      categoryId: z.number().int().positive().optional(),
    },
    handler: async (body: any) => api.post("/products", body),
  },
  {
    name: "products_update",
    description: "Actualiza un producto existente (requiere rol admin)",
    inputSchema: {
      id: z.number().int().positive(),
      name: z.string().min(2).max(100).optional(),
      price: z.number().positive().optional(),
      stock: z.number().int().min(0).optional(),
      categoryId: z.number().int().positive().nullable().optional(),
    },
    handler: async ({ id, ...body }: any) => api.put(`/products/${id}`, body),
  },
  {
    name: "products_update_stock",
    description: "Descuenta stock de un producto (requiere rol admin)",
    inputSchema: {
      id: z.number().int().positive(),
      quantity: z.number().int().positive(),
    },
    handler: async ({ id, quantity }: any) => api.patch(`/products/${id}/stock`, { quantity }),
  },
  {
    name: "products_delete",
    description: "Elimina un producto (requiere rol admin)",
    inputSchema: { id: z.number().int().positive() },
    handler: async ({ id }: any) => api.del(`/products/${id}`),
  },
] as ToolDef[];
