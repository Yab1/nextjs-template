import { type Endpoint, endpoints, publicEndpoints } from "@/lib/api/endpoints";
import { ACCESS_EXPIRES_COOKIE } from "@/lib/auth/session";

const REFRESH_BUFFER_SECONDS = 45;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  skipAuthRefresh?: boolean;
};

let refreshRequest: Promise<boolean> | null = null;

function redirectToLogin() {
  if (typeof window === "undefined") {
    return;
  }
  if (window.location.pathname === "/login") {
    return;
  }
  // Fetch helper sits outside React, so the router is not available here.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- full navigation drops the expired session
  window.location.assign("/login");
}

function accessExpiresSoon() {
  if (typeof document === "undefined") {
    return false;
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${ACCESS_EXPIRES_COOKIE}=([^;]*)`)
  );
  if (!match) {
    return false;
  }

  const expiresAt = Number(decodeURIComponent(match[1]));
  if (!Number.isFinite(expiresAt)) {
    return false;
  }

  return expiresAt - Date.now() / 1000 <= REFRESH_BUFFER_SECONDS;
}

function refreshAccess() {
  if (!refreshRequest) {
    refreshRequest = fetch(endpoints.refresh, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    })
      .then((response) => response.ok)
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

export async function api<T>(path: Endpoint, options: RequestOptions = {}) {
  const { body, headers, skipAuthRefresh, ...rest } = options;
  const isPublic = publicEndpoints.has(path);

  if (!skipAuthRefresh && !isPublic && accessExpiresSoon()) {
    const refreshed = await refreshAccess();
    if (!refreshed) {
      redirectToLogin();
      throw new ApiError("Session expired", 401);
    }
  }

  const response = await fetch(path, {
    ...rest,
    credentials: "include",
    cache: "no-store",
    headers: {
      ...(body === undefined ? {} : { "content-type": "application/json" }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401 && !skipAuthRefresh && !isPublic) {
    const refreshed = await refreshAccess();
    if (refreshed) {
      return api<T>(path, { ...options, skipAuthRefresh: true });
    }
    redirectToLogin();
    throw new ApiError("Session expired", 401);
  }

  const payload = (await response.json().catch(() => null)) as
    { message?: string } | T | null;

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      payload.message
        ? payload.message
        : "Request failed";
    throw new ApiError(message, response.status);
  }

  return payload as T;
}
