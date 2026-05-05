# Social Media Content Calendar

> Signal Raptor Dev Bootcamp — April 2026

![AdonisJS](https://img.shields.io/badge/AdonisJS-6-5A45FF?logo=adonisjs&logoColor=white)
![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-llama3.2-000000?logo=ollama&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)

A full-stack app for planning, scheduling, and AI-generating social media posts. Users manage multiple brands, connect social accounts (Mastodon OAuth), and let a local Ollama model write platform-specific post variations.

---

## Tech Stack

| Layer             | Technology                                        |
| ----------------- | ------------------------------------------------- |
| **Frontend**      | Vue 3 · Vite · Pinia · Vue Router · Tailwind CSS  |
| **Backend**       | AdonisJS 6 (Node 22, ESM, TypeScript)             |
| **Database**      | PostgreSQL 15 — Lucid ORM + VineJS validation     |
| **Cache / Queue** | Redis 7 — API response caching + BullMQ job queue |
| **AI**            | Ollama (llama3.2) via OpenAI-compatible API       |
| **Auth**          | AdonisJS Access Token Guard                       |
| **OAuth**         | Mastodon OAuth 2                                  |
| **DevOps**        | Docker Compose · dumb-init · dockerize            |

---

## Project Structure

```
SMCC/
├── docker-compose.yml
├── server/                         # AdonisJS 6 API
│   ├── app/
│   │   ├── controllers/v1/
│   │   │   ├── auth/               # login · register · logout
│   │   │   ├── users/              # me · profile · password · oauth/mastodon
│   │   │   ├── brands/             # CRUD + brand_members sub-resource
│   │   │   ├── posts/              # CRUD + AI generate
│   │   │   ├── scheduled_posts/    # schedule · cancel · calendar feed
│   │   │   ├── social_accounts/    # connect · disconnect
│   │   │   ├── social_platforms/   # platform registry
│   │   │   └── platforms/          # per-brand platform list
│   │   ├── models/                 # User · Brand · Post · ScheduledPost · SocialAccount · BrandMember
│   │   ├── services/
│   │   │   ├── ai/                 # Ollama wrapper (OpenAI-compat client)
│   │   │   ├── cache_service.ts    # Redis get / set / invalidate helpers
│   │   │   ├── oauth/              # Mastodon OAuth flow
│   │   │   └── platform/           # publish adapters
│   │   ├── middleware/
│   │   ├── jobs/                   # BullMQ: publish_post
│   │   └── validators/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── config/
│   └── start/
│       ├── routes.ts
│       ├── env.ts
│       └── scheduler.ts            # cron: process due scheduled posts
│
└── web/                            # Vue 3 SPA
    └── src/
        ├── views/pages/            # Calendar · Brands · Posts · BrandMembers · Settings
        ├── components/common/      # Button · FormField · AppModal · AppBadge · AppSelect · PageHeader
        ├── stores/                 # Pinia: auth · brand · post · scheduled_post
        └── api/services/           # Axios service layer
```

---

## Docker Setup

Four services defined in `docker-compose.yml`:

| Service    | Image                  | Port(s)                 | Notes                                                                           |
| ---------- | ---------------------- | ----------------------- | ------------------------------------------------------------------------------- |
| `postgres` | `postgres:15`          | `5433:5432`             | volume: `postgres_volume`                                                       |
| `redis`    | `redis:7`              | `6379:6379`             | password: `adonis`; healthcheck                                                 |
| `server`   | built from `./server`  | `8000` · `9229 (debug)` | waits for postgres + redis via `dockerize`; hot-reload with `ace serve --watch` |
| `ollama`   | `ollama/ollama:latest` | `11434`                 | auto-pulls `llama3.2` on first start; volume: `ollama_volume`                   |

> **First run:** Ollama pulls llama3.2 (~2 GB) at startup — this takes a few minutes. Subsequent starts are instant.

### Start everything

```bash
docker compose up
```

### Rebuild containers

```bash
docker compose up --build
```

### Teardown

```bash
# keep volumes (data preserved)
docker compose down

# destroy everything including volumes
docker compose down -v
```

---

## Getting Started

### Prerequisites

- Docker & Docker Compose

### 1. Clone

```bash
git clone <repo-url>
cd SMCC
```

### 2. Create the environment file

```bash
cp server/.env.example server/.env
```

Minimum required values (defaults match the Docker Compose config):

```env
NODE_ENV=development
PORT=8000
HOST=0.0.0.0
LOG_LEVEL=info
APP_KEY=                          # run: node ace generate:key
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DATABASE_URL=postgresql://adonis:adonis@postgres:5432/smcc_db
DB_HOST=postgres
DB_PORT=5432
DB_USER=adonis
DB_PASSWORD=adonis
DB_DATABASE=smcc_db

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=adonis

SESSION_DRIVER=cookie
QUEUE_DRIVER=redis

# Ollama (points to the ollama container)
OLLAMA_BASE_URL=http://ollama:11434
OLLAMA_MODEL=llama3.2
```

### 3. Start the stack

```bash
docker compose up
```

API available at `http://localhost:8000`.

### 4. Run migrations

```bash
docker compose exec server node ace migration:run
```

### 5. (Optional) Seed the database

```bash
docker compose exec server node ace db:seed
```

---

## Key Features

- **Brands** — create brands with name, tone of voice, logo, primary colour and description
- **Brand Members** — invite users with `owner` / `editor` / `viewer` roles; RBAC enforced on every endpoint
- **Posts** — draft posts per brand; track state (`draft → published / failed`)
- **AI Post Generation** — send topic + platform + tone to Ollama; get three ready-to-post variations back instantly
- **Scheduled Posts** — schedule a post to a connected social account at a specific datetime; background cron processes due items via BullMQ
- **Calendar View** — month/week/day FullCalendar showing all scheduled posts; click a day to view, cancel, or add new schedules
- **Social Accounts** — connect Mastodon accounts via OAuth 2; soft-disconnect preserves scheduling history
- **Redis Caching** — index endpoints cached (2–5 min TTL); mutations invalidate related keys automatically

---

## System Design

Full system design documentation: [View on Proton Drive](https://drive.proton.me/urls/NYH9HT2MMW#bUHHVuL85kwG)
