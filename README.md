# WhiteAI

WhiteAI is a focused, full-stack AI chat workspace. It keeps the model credential on the server, streams OpenAI-compatible responses to the browser, stores conversations in SQLite through Prisma, and leaves clear seams for authentication, billing, PostgreSQL, and more models later.

## Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS 4, small shadcn-style UI primitives, Lucide React, Framer Motion
- Prisma ORM with SQLite
- Zod validation
- OpenAI-compatible streaming API via server-side `fetch`

## Requirements

- Node.js 20+
- npm 10+
- A reachable OpenAI-compatible API

## Installation

```bash
npm install
cp .env.example .env
```

Edit `.env` with a fresh server-side credential:

```env
DATABASE_URL="file:./dev.db"
AI_BASE_URL="http://localhost:20128/v1"
AI_API_KEY="your_api_key_here"
AI_MODEL="gc/gemini-3.1-pro-preview"
```

Never put an API key in a client component, README, public file, or Git history. The `.env` file is ignored by Git. If a key has ever been shared in a chat, rotate it and use the replacement only through `AI_API_KEY`.

## Database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

The SQLite file is created under `prisma/` according to `DATABASE_URL`. Prisma's schema uses ordinary relational models and can move to PostgreSQL later by changing the datasource provider, connection URL, and migration setup.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful commands:

```bash
npm run typecheck
npm run lint
npx prisma studio
```

## Production

```bash
npm run build
npm start
```

`build` generates Prisma Client, applies committed migrations, and builds Next.js. In a production deployment, set `DATABASE_URL`, `AI_BASE_URL`, `AI_API_KEY`, and `AI_MODEL` in the hosting environment rather than committing them.

## Docker

Docker is optional. It bundles Node.js, Prisma, and the application runtime while persisting SQLite in a named volume.

```bash
cp .env.example .env
# Add AI_API_KEY to .env, then:
docker compose up --build
```

The default Docker API URL uses `host.docker.internal` so a local API on port `20128` can be reached from the container. For a remote provider, set `AI_BASE_URL` explicitly.

## Architecture

- `app/` contains the App Router pages and server Route Handlers.
- `components/` contains the client UI: chat shell, message rendering, sidebar, model selector, settings, and small UI primitives.
- `lib/ai.ts` is the only place that talks to the AI provider. It owns credentials, timeout handling, provider error mapping, and health checks.
- `lib/validation.ts` owns request schemas. `lib/rate-limit.ts` provides a small in-memory limiter suitable for a single local instance; use Redis or an edge-aware limiter when scaling horizontally.
- `lib/db.ts` owns the Prisma singleton.
- `prisma/schema.prisma` defines `Chat` and `Message`, with cascade delete and indexes for history queries.

## API

### `POST /api/chat`

Accepts:

```json
{
  "chatId": "chat-id",
  "messages": [{ "role": "user", "content": "Hello" }],
  "model": "gc/gemini-3.1-pro-preview"
}
```

The route validates the body, stores the user message, sends the recent conversation context to `/chat/completions` with `stream: true`, and returns a server-sent event stream:

```text
data: {"type":"delta","content":"..."}

data: {"type":"done"}
```

Credentials never enter the browser bundle. The backend also caps request size, validates the selected model, applies a rate limit, and maps provider failures to safe user-facing messages.

### `GET /api/chats?search=minecraft`

Returns up to 100 chats, newest first. Search is performed server-side against chat titles.

### `POST /api/chats`

Creates an empty chat. The first user message automatically becomes a concise title.

### `GET/PATCH/DELETE /api/chats/:id`

Loads a chat with messages, renames it, or deletes it. Message deletion is handled by the Prisma cascade relation.

### `GET /api/health`

Checks the configured AI service without exposing credentials. The Settings dialog uses it to show connection status.

## Adding models

Add an item to `lib/models.ts`:

```ts
{
  id: "provider/model-id",
  name: "Model name",
  provider: "Provider",
  description: "Short product description",
}
```

The selector, validation, and backend whitelist use the same registry. Set `AI_MODEL` to the desired default.

## Changing providers

WhiteAI expects the OpenAI Chat Completions contract. For another provider, keep the UI and database unchanged and adapt `lib/ai.ts` to its request and streaming format. Keep any provider secret in the server environment only.

## Authentication and future work

The current local product has no account layer by design. Add authentication at the Route Handler boundary, associate `Chat` with a user ID, and scope every query by that ID before exposing the service to multiple users. Billing can be added at the same boundary without changing the chat UI or streaming contract.

## GitHub deployment checklist

1. Commit the project, `prisma/migrations`, `.env.example`, and this README.
2. Do not commit `.env`, database files, or credentials.
3. Configure the four environment variables in the deployment provider.
4. Use a persistent PostgreSQL database for multi-user production.
5. Run migrations during deployment with `npx prisma migrate deploy`.
6. Put the AI API behind a network path reachable by the server, not directly in the browser.

## License

MIT. See `LICENSE`.
