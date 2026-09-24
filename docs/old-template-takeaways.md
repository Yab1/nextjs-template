# Takeaways from the old templates

Compared on 2026-09-24.

|                 | `template-nextjs`   | `next-start`                                                   | this repo                           |
| --------------- | ------------------- | -------------------------------------------------------------- | ----------------------------------- |
| Next / React    | 14.2.4 / 18         | 14.2.15 / 18                                                   | 16.3.6 / 19                         |
| Package manager | Yarn 1              | pnpm 9                                                         | Yarn 4, `node-modules` linker       |
| Tailwind        | 3                   | 3 + shadcn tokens                                              | 4, CSS import only                  |
| ESLint          | 8, two configs      | 8, one config                                                  | 9 flat config, `eslint-config-next` |
| App code        | `app/` at repo root | `src/app`, `src/components`, `src/lib`, `src/hooks`, `src/env` | `app/` at repo root                 |

`next-start` is the template worth copying. `template-nextjs` is an earlier, thinner version of the same idea. Port the patterns onto Next 16. Do not copy the Next 14 dependency versions.

## Packages

Versions below are what those repos pin. This template stays on Next 16, React 19, ESLint 9, and Tailwind 4. Copy the package names, then install current majors.

### `template-nextjs`

Runtime: `next`, `react`, `react-dom` only.

Dev:

| Package                                              | Role                                                                        |
| ---------------------------------------------------- | --------------------------------------------------------------------------- |
| `@commitlint/cli`, `@commitlint/config-conventional` | commit messages                                                             |
| `@types/node`, `@types/react`, `@types/react-dom`    | types                                                                       |
| `eslint`, `eslint-config-next`                       | lint                                                                        |
| `husky`                                              | git hooks                                                                   |
| `pinst`                                              | disables Husky when the package is published. This app is private. Skip it. |
| `postcss`                                            | Tailwind 3 pipeline. Tailwind 4 uses `@tailwindcss/postcss`, already here.  |
| `prettier`                                           | format                                                                      |
| `tailwindcss`                                        | styles                                                                      |
| `typescript`                                         | types                                                                       |

`eslint.config.mjs` imports `globals`, `@eslint/js`, `typescript-eslint`, and `eslint-plugin-react`. None of those are in `package.json`. Dead config.

### `next-start`

Runtime, beyond Next and React:

| Package                    | Used for                                     | Bring it                               |
| -------------------------- | -------------------------------------------- | -------------------------------------- |
| `zod`                      | env schema                                   | yes                                    |
| `@t3-oss/env-nextjs`       | validated env                                | yes                                    |
| `clsx`, `tailwind-merge`   | `cn()`                                       | yes, with the UI kit                   |
| `class-variance-authority` | `Button` variants                            | yes, with shadcn                       |
| `@radix-ui/react-slot`     | shadcn `Button` `asChild`                    | yes, with shadcn                       |
| `lucide-react`             | icons in the theme switcher and 404          | only with that UI                      |
| `next-themes`              | dark mode provider                           | only if every app needs a theme toggle |
| `tailwindcss-animate`      | Tailwind 3 animation plugin                  | no. Recheck the Tailwind 4 equivalent. |
| `jiti`                     | loads the TS env file from `next.config.mjs` | no. `next.config.ts` can import it.    |
| `@radix-ui/react-icons`    | listed, never imported                       | no                                     |

Dev, on top of the same commitlint, types, eslint, husky, postcss, prettier, tailwind, and typescript set:

| Package                                 | Role                                       |
| --------------------------------------- | ------------------------------------------ |
| `eslint-config-prettier`                | turns off ESLint rules that fight Prettier |
| `eslint-plugin-check-file`              | kebab-case file and folder names           |
| `eslint-plugin-n`                       | `n/no-process-env`                         |
| `@trivago/prettier-plugin-sort-imports` | import groups                              |
| `prettier-plugin-tailwindcss`           | sort Tailwind classes                      |

Neither old repo has `lint-staged`. Hooks call the full scripts.

### Already in this repo

`next`, `react`, `react-dom`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom`, `eslint`, `eslint-config-next`, `tailwindcss`, `typescript`.

## Take from `next-start`

### Quality scripts

`package.json` already splits the checks:

- `format` — Prettier write
- `check-format` — Prettier check
- `check-types` — `tsc --pretty --noEmit`
- `lint` — ESLint
- `test-all` — types, then format, then lint, then build

This repo only has `lint`. Add the other four. `test-all` is the CI command.

### Git hooks

Both repos use Husky 9 and the same commitlint config.

| Hook       | `template-nextjs` | `next-start`                                   |
| ---------- | ----------------- | ---------------------------------------------- |
| pre-commit | `yarn lint` only  | full typecheck, full Prettier check, full lint |
| commit-msg | commitlint        | commitlint                                     |
| pre-push   | `yarn build`      | `pnpm build`                                   |

Commit types in both: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`, `translation`, `security`, `changeset`. Header max 100. Subject must not be empty, must not end with a period, must not be sentence/start/pascal/upper case.

Port commitlint as-is.

Change the pre-commit behavior. `next-start` typechecks and lints the whole repo on every commit. That is strict and slow, and there is no lint-staged. For this template: pre-commit runs Prettier and ESLint on staged files only. `check-types` and `build` stay on pre-push and in CI, which is what both old repos already do on push.

Husky install in `template-nextjs` is the old pair (`postinstall` and `prepare` both call `husky install`). Husky 9 only needs `prepare`: `husky`. Drop `pinst`. It is for published npm packages, and this template is private.

### ESLint rules worth keeping

`next-start` `.eslintrc.json`:

- extends `next/core-web-vitals`, `next/typescript`, `prettier`
- `eslint-plugin-check-file`: `src/**` files and folders are `KEBAB_CASE` (middle extensions like `.test` ignored)
- `eslint-plugin-n`: `n/no-process-env` is an error, so app code must read env from the validated module
- also errors: `prefer-arrow-callback`, `prefer-template`, `semi`, `quotes` double

Rewrite this onto the existing ESLint 9 flat config. Do not bring back `.eslintrc.json`. `semi` and `quotes` should live in Prettier, with `eslint-config-prettier` turning the ESLint copies off. `next-start` sets both, which means the two tools overlap.

`template-nextjs` has two ESLint configs that do not agree:

- `.eslintrc.json` extends Next
- `eslint.config.mjs` uses `typescript-eslint` and `eslint-plugin-react`, and those packages are not even dependencies

Ignore that flat config.

### Prettier

Use the `next-start` file, not the other one.

`next-start`:

- semicolons, double quotes, tab width 2, trailing comma `es5`
- import order: `react` / `next`, third-party, `@/`, then relative, with a blank line between groups (`@trivago/prettier-plugin-sort-imports`)
- `prettier-plugin-tailwindcss` last, so Tailwind class sorting runs after import sorting

`template-nextjs` uses tabs and `tabWidth: 1`, while its VS Code settings say tab size 2. Do not copy that.

Ignore lists in both: `.next`, `dist`, `node_modules`, plus the lockfile. Add `yarn.lock` only if we do not want it formatted. Lockfiles are usually ignored.

### Env validation

`next-start` `src/env/server.ts` uses `@t3-oss/env-nextjs` and Zod. The only variable today is `NODE_ENV`. Empty strings count as unset. Invalid env prints the field errors and exits the process.

`next.config.mjs` loads that file with `jiti` so dev and build fail before the app boots. `n/no-process-env` blocks raw `process.env` everywhere else. `.env.example` documents the variables.

Port the pattern. Drop `jiti`. This repo's config is already `next.config.ts`, so it can import the env module directly.

### Folder layout

`next-start` is the layout to use:

```
src/app          routes, globals.css, loading, not-found
src/components   app components
src/components/ui   shadcn primitives
src/hooks
src/lib/utils.ts    cn()
src/env/server.ts
```

`tsconfig` paths: `"@/*": ["./src/*"]`. This repo currently maps `@/*` to `./*` because there is no `src/`.

`template-nextjs` keeps `app/` at the root and uses a route group `app/(root)/page.tsx` for an otherwise empty home page. The route group adds nothing. Skip it.

### UI kit

`next-start` is a shadcn New York setup:

- `components.json` (RSC, TSX, slate, aliases for components, ui, lib, hooks)
- `clsx` + `tailwind-merge` as `cn()` in `src/lib/utils.ts`
- `class-variance-authority` on `Button`
- `@radix-ui/react-slot`, `lucide-react`, `tailwindcss-animate`
- CSS variables for background, foreground, card, primary, and the rest, plus a `.dark` set
- `next-themes` via `src/components/providers.tsx`, a theme switcher, and `use-system-theme`

Take `cn()`, the token setup, and shadcn aliases if this template ships a component baseline. Tailwind 4 does not use `tailwind.config.ts` the way v3 did, so the color map has to be rewritten as `@theme` in CSS. `components.json` still points at `tailwind.config.ts` and sets `cssVariables: false` while `globals.css` uses variables. Fix that when regenerating shadcn for Tailwind 4. Do not copy `tailwindcss-animate` until we know the v4 equivalent.

Theme switcher, background SVGs, the home card, and the emoji favicon are demo UI. Leave them out. A blank `loading.tsx` and `not-found.tsx` are worth keeping. The old ones render a card and the text "Loading".

### Editor and engines

`next-start` VS Code settings: format on save, ESLint fix on save, organize imports, associate `*.css` with Tailwind, use the workspace TypeScript. `template-nextjs` adds Prettier as the default formatter and format on paste. This repo's `.vscode/settings.json` is only Peacock colors. Merge the editor settings in without deleting the Peacock block.

Both old repos set `engines.node` to `>=20.14.0` and `engine-strict=true` in `.npmrc`, and they block the wrong package manager. This repo is Yarn 4 (`packageManager` is already `yarn@4.9.3`). Engines should require Node and Yarn, and reject npm and pnpm.

`next-start` `.npmrc` also hoists `@nextui-org/*`. NextUI is not a dependency. Do not copy that line.

## Leave behind

- Next 14, React 18, Tailwind 3, ESLint 8, and `next lint`. This repo already lints with the `eslint` CLI. `next lint` is the old command.
- `template-nextjs` Prettier tabs and the duplicate ESLint flat config.
- `pinst`, and `husky install`.
- Demo pages, decorative SVGs, Inter font, and the create-next-app README still sitting in `next-start`.
- `experimental.typedRoutes` as written. Typed routes are real, but the Next 16 flag needs a fresh check before copying a Next 14 experimental key.
- The `next-themes` import from `next-themes/dist/types`. That path breaks across versions. Import the public type.

## Suggested order for this repo

1. `src/` move and `@/*` path update.
2. Prettier, `eslint-config-prettier`, Tailwind class sorting, import sorting.
3. ESLint flat-config additions: Prettier compat, kebab-case paths, no raw `process.env`.
4. Husky, commitlint, lint-staged. Pre-push build.
5. Scripts: `format`, `check-format`, `check-types`, `check`.
6. Zod env module, `.env.example`, import it from `next.config.ts`.
7. `cn()`, design tokens, then shadcn only if the template should ship UI primitives.
8. Engines, `.npmrc` engine-strict, VS Code format-on-save.
