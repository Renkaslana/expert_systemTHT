# Diagnova Backend

Express + TypeScript + Prisma backend for the Diagnova ENT expert system.
Implements a Certainty Factor (CF) inference engine based on
Setyaputri, Fadlil & Sunardi (2018), Universitas Ahmad Dahlan.

## Stack

- **Runtime:** Node.js ≥ 20
- **Framework:** Express 4
- **Language:** TypeScript 5
- **ORM:** Prisma 5 + PostgreSQL 15
- **Validation:** Zod
- **Test:** Vitest + supertest

## Setup (local development)

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Setup PostgreSQL

Make sure PostgreSQL is running locally. Create the database:

```bash
# Connect as superuser (adjust if your setup differs)
psql -U postgres

# In psql:
CREATE DATABASE diagnova;
\q
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env if your Postgres credentials differ
```

### 4. Generate Prisma client + run migrations

```bash
npm run prisma:generate
npm run prisma:migrate    # creates migration + applies to DB
```

### 5. Seed knowledge base (after Fase 3)

```bash
npm run prisma:seed       # 24 symptoms + 5 diseases + 34 CF rules
```

### 6. Run dev server

```bash
npm run dev
```

API available at: `http://localhost:3001/api/v1`

Health check: `curl http://localhost:3001/api/v1/health`

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TS to `dist/` |
| `npm run start` | Run compiled production build |
| `npm test` | Run all tests |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run format` | Prettier write |
| `npm run typecheck` | TypeScript check (no emit) |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |
| `npm run prisma:migrate` | Create+apply new migration |
| `npm run prisma:seed` | Seed knowledge base |
| `npm run db:reset` | Reset DB (DROP + recreate + migrate + seed) |

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma         # DB schema
│   └── seed.ts               # Knowledge base seeder
├── src/
│   ├── domain/               # Pure business logic (CF engine)
│   ├── services/             # Application orchestration
│   ├── repositories/         # Prisma data access
│   ├── http/                 # Express layer
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── schemas/          # Zod validation
│   ├── lib/                  # config, prisma, logger, errors
│   ├── mappers/              # DB row → API DTO
│   ├── app.ts                # Express factory
│   └── server.ts             # Entry point
├── tests/
│   ├── integration/
│   └── fixtures/
└── package.json
```

## API

See `docs/API.md` (generated after Fase 4).

## Development phases

Tracking against `~/.claude/plans/jadi-saya-kan-mau-nifty-quokka.md`.

- ✅ Fase 1 — Foundation (this commit)
- ⏳ Fase 2 — CF Engine domain + tests
- ⏳ Fase 3 — Knowledge base seed
- ⏳ Fase 4 — Public API endpoints
- ⏳ Fase 5 — Session persistence
- ⏳ Fase 6 — Frontend integration
- ⏳ Fase 7 — Polish & deploy
