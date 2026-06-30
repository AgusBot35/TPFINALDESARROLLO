export interface SafeUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  isVerified: boolean;
}

export type UserRole = 'user' | 'admin';

export interface UpdateUserRoleDto {
  role: UserRole;
}

export interface ChangePassword {
  newPassword: string,
  currentPassword: string
}

export interface ChangeEmail{
  newEmail: string,
  password: string
}
