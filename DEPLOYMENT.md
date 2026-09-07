# Production Deployment & Environment Guide

This document describes how to deploy, manage, update, and rollback the application across macOS development and Ubuntu production environments.

---

## 1. Prerequisites

### Software Requirements
* **Node.js**: v18.x or v20.x LTS
* **npm**: v9.x or later (shipped with Node.js)
* **PostgreSQL** (for canonical backend/trader DB): v14.x or later
* **Git**: v2.30+
* **Nginx**: Pre-installed reverse proxy on Ubuntu Oracle Compute VM

---

## 2. Environment Variables & `.env` Setup

Copy `.env.example` to create the production environment configuration file. **Do not commit `.env` to Git.**

```bash
cp .env.example .env
chmod 600 .env
```

### Environment Variable Reference

| Variable | Required | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Yes | `production` | Runtime mode (`development` vs `production`) |
| `HOST` | Yes | `127.0.0.1` | Loopback binding address (prevents direct public access) |
| `PORT` | Yes | `3000` | Application service port bound locally behind Nginx |
| `DATABASE_URL` | Yes | `postgresql://...` | Canonical PostgreSQL connection string |
| `DB_POOL_MIN` | No | `2` | Minimum database connection pool size |
| `DB_POOL_MAX` | No | `10` | Maximum database connection pool size |

---

## 3. Installation & Build Commands

### Clean Install (Reproducible Dependencies)
Always use `npm ci` in production to ensure exact lockfile versions:

```bash
npm ci
```

### Production Asset Build
Compile TypeScript and bundle production assets:

```bash
npm run build
```

---

## 4. Canonical Database Migration Command

Run idempotent schema migrations prior to launching or updating service instances:

```bash
# Execute idempotent database migrations using DATABASE_URL
npm run migrate # or npx prisma migrate deploy / npx knex migrate:latest
```

> [!IMPORTANT]
> The database migration command must be non-destructive. Do not run table resets or drops in production.

---

## 5. Production Start Command

Start the application service in production mode (bound loopback to `127.0.0.1:${PORT}`):

```bash
npm run start
```

---

## 6. Health Check & Verification

Verify that the local service is running and healthy on loopback:

```bash
# Verify local HTTP status
curl -i http://127.0.0.1:3000/

# Verify Nginx reverse proxy endpoint
curl -i https://shabu.longwarp.com/
```

---

## 7. Update & Redeploy Procedure

To pull the latest release from GitHub and deploy cleanly:

```bash
# 1. Fetch latest changes from main branch
git fetch origin main
git checkout main
git pull origin main

# 2. Reproduce exact dependencies
npm ci

# 3. Execute idempotent database migrations
npm run migrate 2>/dev/null || true

# 4. Build production bundle
npm run build

# 5. Restart application process
# (Managed by your system administrator via systemd)
```

---

## 8. Rollback Procedure

If a deployed version experiences issues:

```bash
# 1. Check git commit history
git log -n 5 --oneline

# 2. Checkout target stable commit/tag
git checkout <STABLE_COMMIT_HASH>

# 3. Reinstall locked dependencies
npm ci

# 4. Rebuild static assets
npm run build

# 5. Restart process
```
