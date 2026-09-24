"use client";

import type { ReactNode } from "react";

import { useSession } from "@/hooks/use-session";
import { type Permission, hasPermission } from "@/lib/auth/permissions";

export function Can({
  permission,
  children,
}: {
  permission: Permission;
  children: ReactNode;
}) {
  const { data } = useSession();

  if (!hasPermission(data?.user.roles, permission)) {
    return null;
  }

  return children;
}
