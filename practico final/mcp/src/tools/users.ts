import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "users_list_external",
    description: "Lista usuarios externos (JSONPlaceholder o locales según configuración)",
    handler: async () => api.get("/users"),
  },
  {
    name: "users_get_external",
    description: "Obtiene un usuario externo por ID numérico",
    inputSchema: { id: z.number().int().positive() },
    handler: async ({ id }: any) => api.get(`/users/${id}`),
  },
  {
    name: "users_list_auth",
    description: "Lista todos los usuarios autenticados del sistema (requiere rol admin)",
    handler: async () => api.get("/users/auth-users"),
  },
  {
    name: "users_update_role",
    description: "Cambia el rol de un usuario (requiere rol admin, no se puede cambiar el propio rol)",
    inputSchema: {
      id: z.string().uuid(),
      role: z.enum(["user", "admin"]),
    },
    handler: async ({ id, role }: any) => api.patch(`/users/${id}/role`, { role }),
  },
  {
    name: "users_delete_me",
    description: "Elimina la cuenta del usuario autenticado (requiere confirmación de contraseña)",
    inputSchema: { password: z.string() },
    handler: async (body: any) => api.del("/users/me", { data: body }),
  },
] as ToolDef[];
