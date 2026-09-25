# Next.js template

Enterprise starting point for new Next.js apps. Next.js 16, React 19, TypeScript, Tailwind CSS 4.

Every feature is listed in [FEATURES.md](FEATURES.md).

## Setup

```bash
yarn install
cp .env.example .env.local
yarn dev
```

Open http://localhost:3000.

Node `>=20.14.0` and Yarn 4. `engine-strict` rejects npm and pnpm.

## Scripts

| Script              | What it does                                     |
| ------------------- | ------------------------------------------------ |
| `yarn dev`          | Dev server                                       |
| `yarn lint`         | ESLint                                           |
| `yarn lint:fix`     | ESLint with fixes                                |
| `yarn format`       | Prettier write                                   |
| `yarn check-format` | Prettier check                                   |
| `yarn check-types`  | `tsc --noEmit`                                   |
| `yarn test`         | Vitest                                           |
| `yarn test:e2e`     | Playwright smoke test. Run `yarn build` first. Uses port 3001. |
| `yarn check`        | Types, format, lint, tests, and production build |
| `yarn build`        | Production build                                 |

## Git hooks

- pre-commit: Prettier and ESLint on staged files
- commit-msg: Conventional Commits (`feat:`, `fix:`, `chore:`, and the rest in `commitlint.config.ts`)
- pre-push: typecheck, then `yarn build`

## CI

`.github/workflows/ci.yml` runs `yarn check`, then the Playwright smoke test, on every push and pull request to `main`. Require that workflow before merging. Jenkins (`deploy/Jenkinsfile`) only deploys.

Dependabot (`.github/dependabot.yml`) opens a weekly pull request for npm and GitHub Actions updates.

`reportError()` in `src/lib/report-error.ts` is the only error-reporting call. Error screens and failed API requests use it. Point that function at Sentry when a project needs it.

## Layout

```
src/app             routes, including auth route handlers
src/components      UI primitives, app shell, theme panel
src/config/theme.ts allowed theme options
src/lib             API client, auth helpers, theme resolution
src/env/server.ts   validated server env
deploy/             Docker blue-green deploy and Jenkins
```

Import app code with `@/`. Do not read `process.env` outside `src/env/server.ts`.

## Env

`.env.example` lists the variables. `src/env/server.ts` validates them at startup. Add a key there and in `.env.example` together.

`API_URL` empty means no external API. Auth screens still sign in through a local fixture: `admin@example.com` is the admin, any other email is a user, password length is the only check. Set `API_URL` when a backend exists. The route handlers then call that API and return its errors. The session cookie is still built locally until a project stores the backend tokens.

## API calls

Browser code calls this app through `api(endpoints.*)`. Server code calls the external API through `callBackend(backendEndpoints.*)`. Add the path in `src/lib/api/endpoints.ts`. Do not write a URL string at the call site. Agents follow `.cursor/rules/project-conventions.mdc`.

## Theme

`src/config/theme.ts` is the allow-list. Delete an option to hide it. The browser stores the pick in the `app-theme` cookie. Values outside the allow-list are dropped.

## Deploy

See `deploy/README.md`. Copy `deploy/.env.example` to `deploy/.env`, then `make -C deploy deploy`.
