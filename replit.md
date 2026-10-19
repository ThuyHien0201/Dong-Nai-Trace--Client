# Đồng Nai Trace

A product traceability platform for Đồng Nai province, Vietnam. Enables government departments and businesses to register, manage, and trace agricultural/industrial products via QR codes and a public portal.

## Architecture

| Package | Role |
|---|---|
| `artifacts/dong-nai-trace-client` | React + Vite admin dashboard (frontend) |
| `artifacts/api-server` | Express.js REST API (backend) |
| `lib/db` | PostgreSQL schema & migrations via Drizzle ORM |
| `lib/api-spec` | OpenAPI spec + Orval codegen |
| `lib/api-zod` | Generated Zod validation schemas |
| `lib/api-client-react` | Generated React Query hooks for the frontend |

## Running

The web client is the only service started for this Replit setup:

- **Frontend** — `artifacts/dong-nai-trace-client: web` (port supplied through `$PORT`, default 21771)

The API server, mobile app, and component preview server are separate workflows and are not started. The current web client renders without the API server; server-backed functionality will require starting the API separately.

To install dependencies from the lockfile:
```bash
pnpm install --frozen-lockfile
```

To start only the web client, restart the managed workflow `artifacts/dong-nai-trace-client: web`.

To run DB migrations:
```bash
pnpm --filter @workspace/db run db:migrate
```

## User preferences
