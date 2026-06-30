import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "list_categories",
    description: "Listar todas las categorías",
    handler: async () => api.get("/categories"),
  },
  {
    name: "get_category",
    description: "Obtener una categoría por su ID",
    inputSchema: { id: z.string() },
    handler: async ({ id }: any) => api.get(`/categories/${id}`),
  },
  {
    name: "create_category",
    description: "Crear una nueva categoría (requiere rol Admin)",
    inputSchema: {
      name: z.string().nonempty().min(1).max(128)
    },
    handler: async (body: any) => api.post("/categories", body),
  },
  {
    name: "update_category",
    description: "Actualizar una categoría existente (requiere rol Admin)",
    inputSchema: {
      id: z.number().int(),
      name: z.string().nonempty().min(1).max(128)
    },
    handler: async ({ id, ...body }: any) => api.put(`/categories/${id}`, body),
  },
  {
    name: "delete_category",
    description: "Eliminar una categoría por su ID (requiere rol Admin)",
    inputSchema: { id: z.number().int() },
    handler: async ({ id }: any) => api.del(`/categories/${id}`),
  },
] as ToolDef[];