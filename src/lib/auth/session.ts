import type { Session, SessionUser } from "@/lib/auth/types";

export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";
export const ACCESS_EXPIRES_COOKIE = "access_expires_at";

export const ACCESS_TTL_SECONDS = 60 * 15;
export const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 7;

type TokenType = "access" | "refresh";

type TokenPayload = SessionUser & {
  exp: number;
  type: TokenType;
};

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

export function createToken(
  user: SessionUser,
  type: TokenType,
  ttlSeconds: number
) {
  const payload: TokenPayload = {
    ...user,
    type,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  return JSON.stringify(payload);
}

export function readToken(
  value: string | undefined,
  type: TokenType
): SessionUser | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as TokenPayload;
    if (parsed.type !== type || typeof parsed.exp !== "number") {
      return null;
    }
    if (parsed.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    if (!parsed.email || !Array.isArray(parsed.roles)) {
      return null;
    }

    return {
      id: parsed.id,
      email: parsed.email,
      name: parsed.name,
      roles: parsed.roles,
    };
  } catch {
    return null;
  }
}

export function toSession(user: SessionUser | null): Session | null {
  return user ? { user } : null;
}
