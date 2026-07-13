# Aygoot App Guide

## Local Ports

- App: `http://localhost:3000`
- PostgreSQL inside Docker: `5432`
- Current Docker host mapping: `localhost:5433 -> container:5432`

Use `localhost:5433` in `.env` while the container is mapped as `0.0.0.0:5433->5432/tcp`.
If you recreate Docker so the host port is `5432`, change `DATABASE_URL` to use `localhost:5432`.

## Daily Run

```bash
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm db:bootstrap-admin
pnpm dev
```

Open `http://localhost:3000`.

## Database Setup

1. Start PostgreSQL in Docker.
2. Confirm the port mapping:

```bash
docker ps
```

3. Make sure `.env` points to the host port:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/aygoot?schema=public"
```

4. Apply migrations and bootstrap the administrator:

```bash
pnpm prisma migrate dev
pnpm db:bootstrap-admin
```

5. Seed catalogue/demo data only when needed:

```bash
pnpm db:seed
```

`pnpm db:bootstrap-admin` is safe to rerun. It creates or updates the administrator
from `ADMIN_SEED_NAME`, `ADMIN_SEED_EMAIL`, and `ADMIN_SEED_PASSWORD` without
resetting an existing password unless `ADMIN_SEED_FORCE_PASSWORD_RESET="true"`.

## After Schema Changes

When `prisma/schema.prisma` changes:

```bash
pnpm prisma validate
pnpm prisma migrate dev
pnpm prisma generate
pnpm db:bootstrap-admin
pnpm check
```

Use `pnpm prisma migrate dev` for local development so Prisma creates/applies migrations.
Avoid `pnpm prisma db push` unless you intentionally want to sync a throwaway database without migration history.

## After Seed Data Changes

When only `prisma/seed.ts` changes:

```bash
pnpm db:seed
```

The current seed expects `ADMIN_SEED_NAME`, `ADMIN_SEED_EMAIL`, and
`ADMIN_SEED_PASSWORD`, and expects `prisma/cottage-image-manifest.json` by default
for catalogue images. It writes Blob URLs into `HouseImage` and no longer deletes
admin-created houses that are absent from the hardcoded seed list.
For explicit local-only development without Blob, run:

```bash
USE_LOCAL_COTTAGE_MEDIA=true pnpm db:seed
```

Do not use local media mode for production or Railway.

## Cottage Image Blob Migration

Real cottage source images live in `public/mediaNew/cottages-basic-info`.
They should stay in the repo until Blob URLs have been uploaded and verified.

Required environment variable:

```env
BLOB_READ_WRITE_TOKEN="..."
```

Run the migration:

```bash
pnpm blob:upload-cottages
pnpm db:seed
```

The upload script:

- uploads supported cottage images to Vercel Blob with public access
- writes `prisma/cottage-image-manifest.json`
- updates existing local `HouseImage.url` rows to exact Blob URLs in a Prisma transaction
- never prints the Blob token

If `pnpm db:seed` says the manifest is missing, run `pnpm blob:upload-cottages` first or use explicit local mode only for development.

## Railway Deployment

Set these Railway variables:

```env
DATABASE_URL="..."
AUTH_SECRET="..."
APP_URL="https://your-railway-domain.example"
BLOB_READ_WRITE_TOKEN="..."
ADMIN_SEED_NAME="AyGood Admin"
ADMIN_SEED_EMAIL="aygoodriverlake@gmail.com"
ADMIN_SEED_PASSWORD="..."
ADMIN_SEED_FORCE_PASSWORD_RESET="false"
ADMIN_NOTIFICATION_EMAIL="aygoodriverlake@gmail.com"
ADMIN_2FA_ENABLED="false"
```

Deploy with the normal production build:

```bash
pnpm install
pnpm prisma generate
pnpm build
pnpm start
```

Apply migrations and production seed against the Railway database:

```bash
pnpm prisma:migrate:deploy
pnpm db:bootstrap-admin
```

Use `migrate deploy` on Railway; reserve `migrate dev` for local development.

## Authentication

Regular users and administrators use the same public login page:

```text
/en/account
```

There is no separate public administrator login page or public admin navigation
link. The administrator email is `aygoodriverlake@gmail.com`; the password is read
from `ADMIN_SEED_PASSWORD` in the ignored `.env` file and must never be committed.

After successful login, administrators are redirected to `/admin`. Regular users
stay in the account area, where they can edit name, phone, preferred language,
change password/email for credential accounts, and view their own booking history.

Google login is hidden until both `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are
configured with real values.

## Validation Commands

```bash
pnpm prisma validate
pnpm typecheck
pnpm build
pnpm check
```

`pnpm check` runs Prisma validation, TypeScript, and production build.

## Common Situations

- Prisma says authentication failed: verify `.env` credentials and whether Docker is exposed on host `5432` or `5433`.
- Prisma cannot connect: confirm Docker is running with `docker ps`.
- App shows stale generated Prisma types: run `pnpm prisma generate`.
- Catalogue data looks wrong: run `pnpm db:seed`, then verify the `House` rows in the database.
- Port `3000` is busy: stop the existing process or run `pnpm dev -- -p 3001`.
