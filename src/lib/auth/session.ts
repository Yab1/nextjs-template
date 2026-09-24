import type { Session } from "@/lib/auth/types";

export const SESSION_COOKIE = "session";

export function createFixtureSession(email: string): Session {
  const admin = email.toLowerCase() === "admin@example.com";

  return {
    user: {
      id: admin ? "user_admin" : "user_1",
      email,
      name: admin ? "Admin" : "User",
      roles: admin ? ["admin"] : ["user"],
    },
  };
}

export function parseSession(value: string | undefined): Session | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Session;
    if (!parsed.user?.email || !Array.isArray(parsed.user.roles)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
