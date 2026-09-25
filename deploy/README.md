# Deploy

Blue-green Next.js app. Jenkins copies the env file, then `deploy.sh` builds once, starts the idle slot, waits for `/api/health`, switches nginx, and stops the old slot.

## Layout

| Path | Role |
|------|------|
| `Dockerfile` | Multi-stage standalone build. Yarn and `.next/cache` use BuildKit cache mounts. |
| `docker-compose.yml` | `web_blue`, `web_green`, `web_proxy` |
| `nginx/app-active.conf.template` | Proxy upstream placeholder |
| `scripts/deploy.sh` | New slot → `/api/health` → switch → stop old → drop unused commit tags |
| `Jenkinsfile` | Shallow checkout of `main` → env → deploy |

No migrate and no seed. This app has neither.

## Host

```bash
cp deploy/.env.example deploy/.env
make -C deploy deploy
```

Proxy publishes `APP_PORT` (default 3000) to the active slot.

## Jenkins

Point the job at `deploy/Jenkinsfile`. Create credential `nextjs-template-git` for `https://github.com/Yab1/nextjs-template.git`.

On the Jenkins host, put runtime env at `/var/lib/jenkins/api/nextjs-template/nextjs_template.env` (same keys as `deploy/.env.example`). The job copies that file to `deploy/.env`.

After a healthy switch, `deploy.sh` deletes `nextjs_template:<git sha>` tags that neither slot still uses. It keeps `:latest`, the commit just built, and the stopped slot's image. It does not run `docker image prune` or `docker builder prune`. Other jobs share the daemon, and the BuildKit cache is what makes the next build fast.
