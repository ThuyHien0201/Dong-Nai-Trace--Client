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

Both services start automatically via managed workflows:

- **Frontend** — `artifacts/dong-nai-trace-client: web` (port `$PORT`, default 21771)
- **API server** — `artifacts/api-server: API Server` (port 8080)

The API server requires `DATABASE_URL` (provisioned automatically by Replit PostgreSQL).

To install/update dependencies:
```bash
pnpm install
```

To run DB migrations:
```bash
pnpm --filter @workspace/db run db:migrate
```

## User preferences
