# Social Media Content Calendar + AI Post Generator

> **Signal Raptor Dev Bootcamp — April 2026**
> Brand Tools · Week 2 of 4

![AdonisJS](https://img.shields.io/badge/AdonisJS-6-5A45FF?logo=adonisjs&logoColor=white)
![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Claude](https://img.shields.io/badge/Anthropic-Claude-191919?logo=anthropic&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)

A full-stack web application that helps content creators plan, schedule, and generate social media posts using AI. Users manage multiple brands, each with its own tone of voice and connected social platforms. A single click generates three Claude-powered post variations — solving the blank-page problem for marketers.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vue 3 · Vite · Pinia · Vue Router |
| **Backend** | AdonisJS 6 (Node 24, ESM) |
| **ORM** | Lucid (AdonisJS) |
| **Validation** | VineJS |
| **Database** | PostgreSQL 15 |
| **Cache / Sessions** | Redis 7 |
| **AI** | Anthropic Claude API |
| **Auth** | AdonisJS Access Token Guard |
| **Type-safe Client** | Tuyau (`@tuyau/core`) |
| **DevOps** | Docker Compose · dumb-init · dockerize |

---

## Project Structure

```
SMCC/
├── docker-compose.yml          # Orchestrates all services
├── README.md
│
├── server/                     # AdonisJS 6 API
│   ├── Dockerfile              # Multi-stage build (dev → build → prod)
│   ├── adonisrc.ts
│   ├── ace.js
│   ├── package.json
│   ├── tsconfig.json
│   ├── app/
│   │   ├── controllers/v1/
│   │   │   ├── auth/           # login, logout, register ✅
│   │   │   ├── users/          # me ✅
│   │   │   ├── brands/         # CRUD 🚧
│   │   │   ├── platforms/      # brand platforms 🚧
│   │   │   └── posts/          # posts + AI generate 🚧
│   │   ├── middleware/
│   │   ├── models/             # User ✅ · Brand · Post 🚧
│   │   ├── transformers/
│   │   └── validators/
│   ├── config/
│   ├── database/
│   │   └── migrations/         # users ✅ · access_tokens ✅ · brands · posts 🚧
│   ├── providers/
│   └── start/
│       ├── routes.ts
│       ├── kernel.ts
│       └── env.ts
│
└── web/                        # Vue 3 frontend 🚧
    └── (Vite + Pinia + Vue Router — Week 3)
```

> ✅ Implemented &nbsp;·&nbsp; 🚧 Planned

---

## Docker Setup

Services defined in `docker-compose.yml`:

| Service | Image | Container | Ports | Notes |
|---|---|---|---|---|
| `postgres` | `postgres:15` | `smcc_postgres` | `5433:5432` | Volume: `postgres_volume` |
| `redis` | `redis:7` | `smcc_redis` | `6379:6379` | Password protected; healthcheck |
| `server` | Built from `./server` | `smcc_server` | `8000:8000` · `9229:9229` | Waits for postgres + redis via `dockerize` |
| `frontend` | Built from `./web` | `smcc_frontend` | `3000:80` | Vue via nginx 🚧 |

The API server uses `dockerize` to wait for both postgres and redis to be ready before starting, preventing race-condition boot failures.

### Start everything

```bash
docker compose up
```

### Start with rebuild

```bash
docker compose up --build
```

### Teardown (keep volumes)

```bash
docker compose down
```

### Teardown (destroy volumes)

```bash
docker compose down -v
```

---

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 24+ (for local dev without Docker)

### 1. Clone the repo

```bash
git clone <repo-url>
cd SMCC
```

### 2. Create the environment file

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and fill in the values (see [Environment Variables](#environment-variables) below).

```env
DB_CONNECTION=pg
DB_HOST=postgres
DB_PORT=5433
DB_USER=adonis
DB_PASSWORD=adonis
DB_DATABASE=smcc_db
```

### 3. Start the stack

```bash
docker compose up
```

The API will be available at `http://localhost:8000`.

### 4. Run migrations

In a separate terminal once the server container is up:

```bash
docker compose exec server node ace migration:run
```

### 5. (Optional) Seed the database

```bash
docker compose exec server node ace db:seed
```

## System Design

Full system design documentation: [View on Proton Drive](https://drive.proton.me/urls/VA648KSM30#Qswqd6iEoqyW)
