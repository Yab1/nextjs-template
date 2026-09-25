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

export const publicEndpoints = new Set<Endpoint>([
  endpoints.login,
  endpoints.register,
  endpoints.forgotPassword,
  endpoints.resetPassword,
  endpoints.logout,
  endpoints.refresh,
]);
