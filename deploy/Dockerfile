# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS deps

WORKDIR /src

COPY package.json yarn.lock .yarnrc.yml ./

ENV HUSKY=0
RUN --mount=type=cache,target=/root/.yarn/berry/cache \
    corepack enable \
 && corepack prepare yarn@4.9.3 --activate \
 && yarn install --immutable

FROM node:22-bookworm-slim AS builder

WORKDIR /src

COPY --from=deps /src/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV HUSKY=0

RUN --mount=type=cache,target=/src/.next/cache \
    corepack enable \
 && corepack prepare yarn@4.9.3 --activate \
 && yarn build

FROM node:22-bookworm-slim AS runner

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && groupadd --system app \
 && useradd --system --gid app --home /app app

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder --chown=app:app /src/.next/standalone ./
COPY --from=builder --chown=app:app /src/.next/static ./.next/static

USER app

EXPOSE 3000

CMD ["node", "server.js"]
