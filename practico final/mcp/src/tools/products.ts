import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "list_products",
    description: "Listar productos con filtros y paginación",
    inputSchema: {
      name: z.string().optional(),
      sortBy: z.enum(['id', 'price', 'name', 'stock']).optional(),
      order: z.enum(['ASC', 'DESC']).optional(),
      page: z.number().int().positive().optional(),
      limit: z.number().int().positive().optional(),
    },
    handler: async (params: any) => api.get("/products", { params }),
  },
  {
    name: "get_product",
    description: "Obtener un producto por su ID",
    inputSchema: { id: z.number().int() },
    handler: async ({ id }: any) => api.get(`/products/${id}`),
  },
  {
    name: "create_product",
    description: "Crear un nuevo producto (requiere rol Admin)",
    inputSchema: {
      name: z.string().nonempty().min(2).max(256),
      price: z.number().refine((v: number) => Number.isInteger(v * 10000), "Máximo 4 decimales").positive(),
      stock: z.number().int().min(0).optional().default(0),
      categoryId: z.number().int().optional()
    },
    handler: async (body: any) => api.post("/products", body),
  },
  {
    name: "update_product",
    description: "Actualizar un producto existente (requiere rol Admin)",
    inputSchema: {
      id: z.number().int(),
      name: z.string().nonempty().min(2).max(256),
      price: z.number().refine((v: number) => Number.isInteger(v * 10000), "Máximo 4 decimales").positive().optional(),
      stock: z.number().int().min(0).optional().default(0),
      categoryId: z.number().int().optional()
    },
    handler: async ({ id, ...body }: any) => api.put(`/products/${id}`, body),
  },
  {
    name: "delete_product",
    description: "Eliminar un producto por su ID (requiere rol Admin)",
    inputSchema: { id: z.number().int() },
    handler: async ({ id }: any) => api.del(`/products/${id}`),
  },
] as ToolDef[];