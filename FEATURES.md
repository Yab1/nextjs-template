# Features

What this template includes. Setup and commands stay in [README.md](README.md). Deploy steps stay in [deploy/README.md](deploy/README.md).

## App shell

| Feature | Where |
| --- | --- |
| Public pages: home, sign in, register, forgot password, reset password | `src/app/(public)/` |
| Signed-in pages: dashboard, admin | `src/app/(app)/` |
| Sidebar shell, account menu, sign-out confirm dialog | `src/components/app-shell.tsx` |
| Sidebar open or closed, stored in Zustand | `src/stores/ui-store.ts` |
| Loading, not-found, error, and root error screens | `src/app/loading.tsx`, `not-found.tsx`, `error.tsx`, `global-error.tsx` |
| Toasts | Sonner, mounted in `src/components/providers.tsx` |
| UI primitives: button, input, label, dialog, dropdown, skeleton, pagination | `src/components/ui/` |

## Auth

| Feature | Where |
| --- | --- |
| Sign in, register, forgot password, and reset password forms. React Hook Form and Zod | `src/components/auth/` |
| HTTP-only access and refresh cookies, plus a readable access expiry cookie | `src/lib/auth/session.ts` |
| Local fixture when `API_URL` is empty. `admin@example.com` is an admin. Any other email is a user. Password length is the only check | `src/lib/auth/session.ts`, `src/app/api/auth/login/route.ts` |
| When `API_URL` is set, auth routes call the external API and return its errors. The session cookie is still built here until a project stores the backend tokens | `src/lib/api/backend.ts` |
| Refresh about 45 seconds before access expiry, one refresh in flight, retry once on 401, then send the browser to `/login` | `src/lib/api/client.ts` |
| Document load with an expired access cookie and a valid refresh cookie redirects through `/api/auth/refresh` | `src/proxy.ts` |
| Signed-out visitors on a private page go to `/login`. A signed-in visitor on `/login` or `/register` goes to `/dashboard` | `src/proxy.ts` |
| Roles `admin` and `user`. Permissions `dashboard:view` and `admin:view`. `/admin` without `admin:view` goes to `/dashboard` | `src/lib/auth/permissions.ts`, `src/components/can.tsx` |

## Data

| Feature | Where |
| --- | --- |
| Browser calls this app only through `api(endpoints.*)` | `src/lib/api/client.ts`, `src/lib/api/endpoints.ts` |
| Server calls the external API only through `callBackend(backendEndpoints.*)` | `src/lib/api/backend.ts` |
| React Query: 60 second stale time, one retry, no refetch on window focus, refetch when the network returns, pause while offline | `src/lib/query-client.ts` |
| Optimistic update helper: cancel, write, roll back, invalidate | `src/lib/optimistic.ts` |
| Page range and page count helpers, plus a pagination control | `src/lib/pagination.ts`, `src/components/ui/pagination.tsx` |
| Structured console logger | `src/lib/logger.ts` |
| `reportError()` is the only error-reporting call. Replace its body to send errors to Sentry | `src/lib/report-error.ts` |
| Offline bar, and a toast when the connection returns | `src/components/connection-status.tsx` |

## Theme and SEO

| Feature | Where |
| --- | --- |
| Light, dark, and system color mode | `src/components/theme-toggle.tsx`, `next-themes` |
| Theme panel: preset, font, color mode, radius, content layout, scale, sidebar position, sidebar style, shadow, density, contrast | `src/components/theme/theme-customizer.tsx` |
| Allow-list for those options. Delete an option to hide it. `panel: false` hides the button | `src/config/theme.ts` |
| The pick is stored in the `app-theme` cookie so the first paint matches. Values outside the allow-list are dropped | `src/lib/theme/selection.ts` |
| Page titles and Open Graph tags | `src/lib/seo.ts` |

## Security and env

| Feature | Where |
| --- | --- |
| Server env validated with Zod. Empty string counts as unset. `process.env` is read only in `src/env/server.ts` | `src/env/server.ts`, `.env.example` |
| Headers on every route: `X-Frame-Options`, `nosniff`, Referrer-Policy, Permissions-Policy, Content-Security-Policy | `next.config.ts` |
| Health check for deploy | `GET /api/health` |

## Quality

| Feature | Where |
| --- | --- |
| ESLint, Prettier, import order, kebab-case file names under `src/` | `eslint.config.mjs`, `.prettierrc` |
| Husky: lint staged files on commit, Conventional Commits, typecheck and build before push | `.husky/` |
| Unit tests for permissions, pagination, theme resolution, and `reportError()` | `src/**/*.test.ts` |
| Playwright smoke test: sign in, open the dashboard, change the radius, reload | `e2e/smoke.spec.ts` |
| GitHub Actions runs `yarn check`, then the smoke test, on pushes and pull requests to `main` | `.github/workflows/ci.yml` |
| Dependabot opens a weekly pull request for npm and GitHub Actions updates | `.github/dependabot.yml` |
| Agent rule for API calls and `reportError()` | `.cursor/rules/project-conventions.mdc` |

## Deploy

| Feature | Where |
| --- | --- |
| Multi-stage Docker image. Yarn and the Next build cache are kept between builds | `deploy/Dockerfile` |
| Blue-green: start the idle slot, wait for `/api/health`, switch nginx, stop the old slot | `deploy/scripts/deploy.sh` |
| After a healthy switch, delete commit image tags that neither slot still uses. The build cache is kept | `deploy/scripts/deploy.sh` |
| Jenkins: shallow checkout of `main`, copy the env file, deploy | `deploy/Jenkinsfile` |
