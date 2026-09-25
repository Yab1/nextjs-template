/** Routes on this Next app. Browser code calls these through `api()`. */
export const endpoints = {
  login: "/api/auth/login",
  register: "/api/auth/register",
  forgotPassword: "/api/auth/forgot-password",
  resetPassword: "/api/auth/reset-password",
  logout: "/api/auth/logout",
  session: "/api/auth/session",
  refresh: "/api/auth/refresh",
} as const;

export type Endpoint = (typeof endpoints)[keyof typeof endpoints];

/** Paths on the external API. Joined with `API_URL` by `backendUrl()`. */
export const backendEndpoints = {
  login: "/auth/login",
  register: "/auth/register",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  logout: "/auth/logout",
  refresh: "/auth/refresh",
} as const;

export type BackendEndpoint =
  (typeof backendEndpoints)[keyof typeof backendEndpoints];

export const publicEndpoints = new Set<Endpoint>([
  endpoints.login,
  endpoints.register,
  endpoints.forgotPassword,
  endpoints.resetPassword,
  endpoints.logout,
  endpoints.refresh,
]);
