# Đồng Nai Trace

A Vietnamese product traceability platform for Đồng Nai province. Businesses can register products and QR codes; the system tracks and verifies supply chain provenance.

## Stack

- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui (`artifacts/dong-nai-trace-client`)
- **API**: Express 5 + Drizzle ORM + PostgreSQL (`artifacts/api-server`)
- **Monorepo**: pnpm workspaces
- **Shared libs**: `lib/api-zod` (Zod schemas), `lib/api-client-react` (React Query hooks), `lib/db` (Drizzle + schema), `lib/api-spec` (OpenAPI spec + Orval codegen)

## Running the app

The frontend dev server starts automatically via the managed workflow `artifacts/dong-nai-trace-client: web`.

To start the API server (requires `DATABASE_URL`):
```
WorkflowsRestart: artifacts/api-server: API Server
```

## Environment variables

| Variable       | Required by        | Description                        |
|----------------|--------------------|------------------------------------|
| `DATABASE_URL` | `api-server`, `db` | PostgreSQL connection string       |
| `SESSION_SECRET` | `api-server`     | Secret for session signing         |

## Database

Uses Drizzle ORM. To push schema to the database:
```
pnpm --filter @workspace/db run push
```

## API codegen

OpenAPI spec lives at `lib/api-spec/openapi.yaml`. To regenerate React Query hooks and Zod schemas:
```
pnpm run --filter @workspace/api-spec codegen
```

## User preferences

<!-- Add user preferences here -->
