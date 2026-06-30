import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "list_users",
    description: "Listar todos los usuarios (requiere rol Admin)",
    handler: async () => api.get("/users"),
  },
  {
    name: "update_user_role",
    description: "Cambiar el rol de un usuario (requiere rol Admin)",
    inputSchema: {
      id: z.string(),
      role: z.enum(['admin', 'users']),
    },
    handler: async ({ id, ...body }: any) =>
      api.patch(`/users/${id}/role`, body),
  },
  {
    name: "update_my_password",
    description: "Cambiar la contraseña del usuario autenticado",
    inputSchema: {
      currentPassword: z.string(),
      newPassword: z.string().min(8),
    },
    handler: async (body: any) => api.patch("/users/me/password", body),
  },
  {
    name: "update_my_email",
    description: "Cambiar el email del usuario autenticado",
    inputSchema: {
      newEmail: z.email(),
      password: z.string().nonempty()
    },
    handler: async (body: any) => api.patch("/users/me/email", body),
  },
] as ToolDef[];