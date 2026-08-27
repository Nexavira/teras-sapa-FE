# Teras Sapa Frontend

Teras Sapa is a frontend application built with TanStack Start. Business logic,
authentication persistence, and product data live in an external backend and
are accessed over HTTP.

## Setup

Copy `.env.example` to `.env.local` and point `VITE_API_URL` at the backend API:

```env
VITE_APP_TITLE=Teras Sapa
VITE_API_URL=http://localhost:8080
```

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

## API requests

Use `fetchHelper` for calls to the external backend. It prefixes relative
endpoints with `VITE_API_URL`, sends credentials by default, serializes object
bodies as JSON, supports query parameters and FormData, and throws `FetchError`
for non-success responses.

```ts
import { fetchHelper } from '#/utils/fetchHelper'

const product = await fetchHelper<Product, CreateProductInput>(
  '/api/products',
  {
    method: 'POST',
    body: input,
  },
)
```

Domain-specific request functions belong under `src/services`, so components
and query hooks do not depend directly on endpoint details.

## Commands

```bash
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm check
```
