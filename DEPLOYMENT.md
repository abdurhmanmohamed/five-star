# Deployment — `five-stars` on Vercel

| Item | Value |
|---|---|
| Vercel project name | **`five-stars`** (exact — no prefix/suffix) |
| Production URL | **https://five-stars.vercel.app** |
| Framework | Flask (Python 3.12) |
| Git repo | `abdurhmanmohamed/five-star` |
| Function region | `fra1` (Frankfurt) — closest to Egypt users + Supabase `eu-west-1` DB |

> **Account safety:** this creates a **new, separate** project named `five-stars`.
> The existing project `five-star` (singular) is **not** modified, renamed,
> redeployed or deleted. All commands below target `--name five-stars` /
> `project_id` of the new project only. Verify with:
> `vercel ls` / dashboard — you should see both `five-star` and `five-stars`.

## What changed (performance only — zero functional changes)

No routes, models, templates, or business logic were altered. All 29 Flask
routes are byte-identical. Only deployment/performance plumbing was added:

1. **`api/index.py`** — thin Vercel entrypoint (`from server import app`).
   Standard Flask-on-Vercel pattern; no logic lives here.
2. **`vercel.json`** — edge caching + region + timeout:
   - `/static/*` → `Cache-Control: public, max-age=31536000, immutable`
     (CSS/JS/fonts/images served from CDN edge after first hit, never revalidated).
   - Fonts get `Access-Control-Allow-Origin: *` for CDN font loading.
   - Function `api/index.py`: `maxDuration: 60`, `regions: ["fra1"]`.
     Frankfurt cuts round-trip vs the old US-East (`iad1`) default:
     ~35 ms to Egypt + ~15 ms to Supabase Ireland (was ~120 ms + ~70 ms).
3. **`server.py` (timing/config only):**
   - **Cold-start fix:** `db.create_all()` + schema inspection moved from
     import-time to lazy first-request init (once per process, skipped for
     `/static/*`). Import no longer waits on the database; static assets
     never trigger DB work. Same tables/migrations, same result.
   - **Compression:** Flask-Compress tuned (`COMPRESS_LEVEL=6`,
     `COMPRESS_MIN_SIZE=500`, CSS/JS/JSON/HTML/SVG). Verified locally:
     `main.css` 73 KB → 11.5 KB gzipped (~6×).
   - **Connection pool:** `pool_pre_ping`, `pool_recycle=300`, small pool —
     fewer stale-connection retries against the Supabase pooler (6543).
   - **Static fallback headers:** `after_request` sets immutable caching
     locally; on Vercel the edge headers in `vercel.json` take precedence.
   - **Env overrides with identical defaults:** `DATABASE_URL`,
     `SECRET_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_BUCKET`
     (defaults = previous hardcoded values, so behaviour is unchanged
     unless you set them in Vercel).
   - **`imghdr` shim** for Python 3.13+ (removed stdlib module) — same
     JPEG/PNG/GIF/WebP detection for uploads.
4. **`.python-version`** — pins Python `3.12` (avoids 3.13 `imghdr` break).
5. **`.vercelignore`** — excludes `__pycache__/`, `instance/*.db`,
   `fivestar passwords.txt` (secrets), `.git/`, `.vercel/` from the bundle.
6. **`requirements.txt`** — removed `pandas==2.2.2` (~30 MB with numpy).
   It was only used by `analytics_blueprint.py`, which is disabled
   (`# from analytics_blueprint import analytics_bp` in `server.py`).
   No runtime impact; faster builds + smaller function bundle.
   To re-enable the blueprint later, re-add `pandas==2.2.2` and uncomment
   the import/register lines.

Templates and `static/` assets were **not** touched (no `defer`/bundling
edits) to guarantee identical rendering and script order.

## Option A — Git integration (recommended, already wired)

The `five-stars` project is linked to `abdurhmanmohamed/five-star`.
Every push to the production branch auto-deploys to
`https://five-stars.vercel.app` only — `five-star` is a separate project
with its own link and is unaffected.

```bash
git checkout main
git merge arena/cf7e40a9-five-star   # or open a PR from the arena branch
git push origin main                  # Vercel auto-deploys to five-stars
```

## Option B — Vercel CLI (manual, same result)

```bash
npm i -g vercel
vercel login

# Link/create ONLY the five-stars project (never five-star)
vercel link --name five-stars --yes

# Preview deploy (does not touch production)
vercel --name five-stars

# Production deploy
vercel --name five-stars --prod

# Verify the exact domain
curl -I https://five-stars.vercel.app/
curl -I https://five-stars.vercel.app/static/css/main.css
# expect: Cache-Control: public, max-age=31536000, immutable
# expect: Content-Encoding: gzip (or br) on text assets
```

## Environment variables (optional — defaults already work)

Set in Vercel → `five-stars` → Settings → Environment Variables
(Production + Preview), then redeploy:

| Key | Purpose |
|---|---|
| `DATABASE_URL` | Supabase Postgres URL (defaults to current hardcoded URL) |
| `SECRET_KEY` | Flask session secret (defaults to current value) |
| `SUPABASE_URL` / `SUPABASE_KEY` / `SUPABASE_BUCKET` | Storage for product images |

> ⚠️ `fivestar passwords.txt` is tracked in git and excluded from Vercel
> via `.vercelignore`, but it is still in the GitHub repo history.
> Rotate those credentials and move them to Vercel env vars.

## Verify performance

```bash
# Cold start (first hit after idle) vs warm (cached)
time curl -s -o /dev/null https://five-stars.vercel.app/
time curl -s -o /dev/null https://five-stars.vercel.app/
time curl -s -o /dev/null https://five-stars.vercel.app/static/css/main.css
```

Expected: first HTML hit includes one lazy DB init; repeat hits are served
from Flask `SimpleCache` (60 s) + edge; static assets are immutable-cached
at the edge after the first fetch.

## Rollback

Vercel → `five-stars` → Deployments → ⋯ → *Promote to Production* on any
previous READY deployment. This never touches `five-star`.
