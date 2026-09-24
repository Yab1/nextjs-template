import type { Role } from "@/lib/auth/types";

export const permissions = {
  "dashboard:view": ["admin", "user"],
  "admin:view": ["admin"],
} as const;

export type Permission = keyof typeof permissions;

export function hasPermission(
  userRoles: Role[] | undefined,
  permission: Permission
) {
  if (!userRoles) {
    return false;
  }

  const allowed = permissions[permission];
  return userRoles.some((role) => (allowed as readonly Role[]).includes(role));
}
