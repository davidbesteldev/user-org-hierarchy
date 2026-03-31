> ⚠️ **Note:** This project was developed exclusively for technical evaluation purposes as part of a recruitment process.

# 🔗 User Org Hierarchy API

API for managing user organizational hierarchies using the **Closure Table pattern**, with a complete **observability stack** (tracing, metrics, and logging).

## 📋 Prerequisites

- **Node.js** (v22.14 or higher)
- **Docker** and **Docker Compose**
- **VS Code with Dev Containers extension** (recommended)

## ⚙️ Initial Setup

```bash
cp .env.example .env
```

## 🚀 Running Options

### 📦 Dev Container

The easiest way to get started with the full observability stack and development tools.

1. Open the project in VS Code.
2. Click "Reopen in Container" when prompted (or run Dev Containers: Reopen in Container from the Command Palette).
3. Once the container is ready, start the app in the integrated terminal:

```bash
npm run start:dev
```

### 🐳 Docker Compose (Validation & Testing)

```bash
docker-compose -f .devcontainer/docker-compose.yml up --build -d
```

### 💻 Local Development

Run Node locally + infra via Docker:

```bash
docker-compose -f .devcontainer/docker-compose.yml up db jaeger elasticsearch kibana prometheus -d

npm install
npm run prisma:migrate:dev
npm run prisma:generate

npm run start:dev
```

## 📊 Observability

| Tool                 | URL                        |
| -------------------- | -------------------------- |
| Tracing (Jaeger)     | http://localhost:16686     |
| Metrics (Prometheus) | http://localhost:9090      |
| Logs (Kibana)        | http://localhost:5601      |
| API Docs (Swagger)   | http://localhost:3001/docs |

## 📖 Development Utilities

### Prisma Studio

Visual interface to inspect and manage database data

```bash
npm run prisma:studio
```

### Database Reset (Destructive)

Full Database Reset (❗ Destructive operation❗) This command irreversibly deletes all data, recreates the database schema, and runs the seed automatically.

```bash
npx prisma migrate reset
```

## 🛠️ Technologies

| Tecnologia                                    | Descrição                                   |
| --------------------------------------------- | ------------------------------------------- |
| [NestJS](https://nestjs.com/)                 | Framework Node.js progressivo               |
| [TypeScript](https://www.typescriptlang.org/) | Superset do JavaScript com tipagem estática |
| [Prisma](https://www.prisma.io/)              | ORM moderno e performático                  |
| [PostgreSQL](https://www.postgresql.org/)     | Banco de dados relacional                   |
| [OpenTelemetry](https://opentelemetry.io/)    | Tracing distribuído e métricas              |
| [Pino](https://github.com/pinojs/pino)        | Logger estruturado de alta performance      |
| [Swagger](https://swagger.io/)                | Documentação e testes de API (OpenAPI)      |
