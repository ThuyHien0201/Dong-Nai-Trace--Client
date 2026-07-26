# Đồng Nai Trace

Đồng Nai Trace is a Vietnamese product traceability portal with a login screen and dashboard experience for managing supply-chain verification data.

## Run & Operate

- `PORT=21771 BASE_PATH=/ pnpm --filter @workspace/dong-nai-trace-client run dev` — run the Vite frontend locally
- `pnpm --filter @workspace/api-server run dev` — run the API server separately (requires `DATABASE_URL`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Frontend env: `PORT=21771` and `BASE_PATH=/`
- API env: `PORT` and `DATABASE_URL` (Postgres connection string)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/dong-nai-trace-client` — React/Vite frontend and the root preview
- `artifacts/api-server` — Express API service with the `/api/healthz` endpoint
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema` — database schema source of truth
- `artifacts/dong-nai-trace-client/src/index.css` — theme tokens and global styles

## Architecture decisions

- The existing pnpm workspace and artifact layout are preserved.
- The frontend is the primary Replit workflow; the API is a separate service because the current frontend flow does not require it to render.
- The frontend uses port `21771` and root `BASE_PATH=/`, matching its existing artifact metadata.

## Product

- Vietnamese-language traceability portal
- Login validation and password recovery guidance
- Dashboard-style traceability views and supply-chain verification UI

## User preferences

No additional user preferences recorded.

## Gotchas

- The Vite config requires both `PORT` and `BASE_PATH`; the Replit workflow supplies them explicitly.
- The API server imports the database package at startup and therefore needs `DATABASE_URL`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
