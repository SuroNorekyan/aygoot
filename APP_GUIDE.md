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

4. Apply migrations and seed:

```bash
pnpm prisma migrate dev
pnpm db:seed
```

## After Schema Changes

When `prisma/schema.prisma` changes:

```bash
pnpm prisma validate
pnpm prisma migrate dev
pnpm prisma generate
pnpm db:seed
pnpm check
```

Use `pnpm prisma migrate dev` for local development so Prisma creates/applies migrations.
Avoid `pnpm prisma db push` unless you intentionally want to sync a throwaway database without migration history.

## After Seed Data Changes

When only `prisma/seed.ts` changes:

```bash
pnpm db:seed
```

The current seed expects `prisma/cottage-image-manifest.json` by default and writes Blob URLs into `HouseImage`.
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
ADMIN_EMAIL="..."
ADMIN_SEED_PASSWORD="..."
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
pnpm db:seed
```

Use `migrate deploy` on Railway; reserve `migrate dev` for local development.

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
