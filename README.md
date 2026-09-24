# Next.js template

Enterprise starting point for new Next.js apps. Next.js 16, React 19, TypeScript, Tailwind CSS 4.

## Setup

```bash
yarn install
cp .env.example .env.local
yarn dev
```

Open http://localhost:3000.

Node `>=20.14.0` and Yarn 4. `engine-strict` rejects npm and pnpm.

## Scripts

| Script              | What it does                              |
| ------------------- | ----------------------------------------- |
| `yarn dev`          | Dev server                                |
| `yarn lint`         | ESLint                                    |
| `yarn lint:fix`     | ESLint with fixes                         |
| `yarn format`       | Prettier write                            |
| `yarn check-format` | Prettier check                            |
| `yarn check-types`  | `tsc --noEmit`                            |
| `yarn check`        | Types, format, lint, and production build |
| `yarn build`        | Production build                          |

## Git hooks

- pre-commit: Prettier and ESLint on staged files
- commit-msg: Conventional Commits (`feat:`, `fix:`, `chore:`, and the rest in `commitlint.config.ts`)
- pre-push: typecheck, then `yarn build`

## Layout

```
src/app          routes
src/components   UI, empty until a design system is added
src/lib          shared helpers
src/env/server.ts  validated server env
```

Import app code with `@/`. Do not read `process.env` outside `src/env/server.ts`.

## Env

`.env.example` lists the variables. `src/env/server.ts` validates them at startup. Add a key there and in `.env.example` together.

Auth screens, session cookie, and `src/proxy.ts` guard `/dashboard` and `/admin`. With `API_URL` empty, `admin@example.com` is the admin fixture and any other email is a user. Set `API_URL` when a real API exists.
