# DirectAds Backend

Backend em NestJS para a aplicacao DirectAds.

## Visao geral

O projeto esta sendo construido com foco em:

- arquitetura modular
- tipagem forte
- infraestrutura reproduzivel
- autenticacao segura com JWT
- documentacao tecnica e operacional clara

No estado atual, o backend ja possui:

- NestJS com TypeScript
- PostgreSQL via Docker
- Prisma com migrations versionadas
- seed preparada
- healthcheck
- autenticacao JWT com registro, login e rota protegida
- Swagger em `/api/docs`
- entidade principal `Task` modelada com ownership por usuario
- CRUD HTTP completo de `tasks` com filtro por status
- lint, build e testes automatizados
- Husky, lint-staged e commitlint

## Stack utilizada

- NestJS
- TypeScript
- PostgreSQL
- Prisma
- Docker
- Docker Compose
- JWT
- Passport
- Swagger
- Jest
- ESLint
- Prettier

## Arquitetura adotada

O projeto segue uma organizacao modular inspirada em Clean Architecture, separando:

- `application`
- `domain`
- `presentation`
- `infrastructure`

Modulos implementados ate aqui:

- `health`
- `prisma`
- `auth`
- `tasks`

Mais detalhes em [architecture.md](e:/directads/docs/architecture.md).

## Estrutura de pastas

```txt
src/
  modules/
    auth/
    health/
    tasks/
  prisma/
  common/
  app.module.ts
  app.setup.ts
  main.ts

prisma/
  schema.prisma
  migrations/
  seed.ts

docs/
  architecture.md
  setup.md
  api.md
  tasks-log.md
```

## Como rodar localmente

### 1. Instalar dependencias

```bash
yarn install
```

### 2. Criar `.env`

Windows:

```bash
copy .env.example .env
```

Unix:

```bash
cp .env.example .env
```

### 3. Subir o PostgreSQL

```bash
docker compose up -d postgres
```

### 4. Preparar o Prisma

```bash
yarn db:generate
yarn db:migrate:dev
yarn db:seed
```

### 5. Iniciar a API

```bash
yarn start:dev
```

## Como rodar com Docker

```bash
docker compose up --build
```

Servicos expostos:

- API: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

## Variaveis de ambiente

Arquivo base: [`.env.example`](e:/directads/.env.example)

```env
PORT=3000
JWT_SECRET="directads-dev-secret"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/directads?schema=public"
```

## Banco de dados

- PostgreSQL como banco principal
- Prisma como ORM
- entidade `User` com `email` unico e `passwordHash`
- entidade `Task` vinculada a `User` por `userId`
- enum `TaskStatus` com `TODO`, `IN_PROGRESS` e `DONE`

Comandos uteis:

```bash
yarn db:generate
yarn db:migrate:dev
yarn db:seed
```

## Scripts principais

```bash
yarn start
yarn start:dev
yarn build
yarn lint
yarn type-check
yarn test
yarn test:integration
yarn test:cov
yarn test:e2e
yarn db:generate
yarn db:migrate:dev
yarn db:seed
```

## Testes

O projeto possui:

- testes unitarios
- testes de integracao
- testes e2e
- threshold global de cobertura em 100%

Comandos:

```bash
yarn test
yarn test:integration
yarn test:cov
yarn test:e2e
```

## API disponivel neste momento

### Healthcheck

- `GET /api/health`

### Autenticacao JWT

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

O endpoint `GET /api/auth/me` exige:

- `Authorization: Bearer <token>`

### Tasks

Todos os endpoints abaixo exigem:

- `Authorization: Bearer <token>`

Rotas disponiveis:

- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/:taskId`
- `PATCH /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`

A listagem aceita filtro opcional por status:

- `GET /api/tasks?status=TODO`
- `GET /api/tasks?status=IN_PROGRESS`
- `GET /api/tasks?status=DONE`

Documentacao detalhada da API: [api.md](e:/directads/docs/api.md)

## Swagger

Documentacao interativa disponivel em:

- `http://localhost:3000/api/docs`

Documento OpenAPI em JSON:

- `http://localhost:3000/api/docs-json`

Como usar bearer token no Swagger:

- autentique em `POST /api/auth/login` ou `POST /api/auth/register`
- copie o `accessToken`
- clique em `Authorize` no Swagger
- informe `Bearer <token>`
- use o mesmo token nas rotas de `tasks`

## JWT

Fluxos implementados:

- registro com hash de senha
- login com comparacao segura de senha
- emissao de token JWT
- rota protegida para usuario autenticado
- CRUD protegido do dominio principal

Payload atual do token:

- `sub`
- `email`

## MFA Microsoft

Ainda nao implementado.

## Dependencias e justificativas

- `@nestjs/*`: base do framework HTTP
- `@prisma/client` e `prisma`: ORM, client tipado e migrations
- `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`: autenticacao JWT
- `bcryptjs`: hash e verificacao de senha
- `@nestjs/swagger` e `swagger-ui-express`: documentacao OpenAPI e UI interativa
- `class-validator` e `class-transformer`: validacao de DTOs
- `jest` e `supertest`: testes automatizados
- `eslint` e `prettier`: qualidade estatica
- `husky`, `lint-staged` e `commitlint`: padrao de desenvolvimento

## Estado atual do roadmap

- concluido: bootstrap do backend
- concluido: Docker + PostgreSQL + Prisma
- concluido: documentacao base
- concluido: autenticacao JWT
- concluido: Swagger
- concluido: modelagem da entidade principal e contratos de repositorio
- concluido: CRUD principal via HTTP
- proximo: MFA Microsoft
- depois: seed final de avaliacao

## Troubleshooting

### A API nao sobe no Docker

```bash
docker compose up --build
```

### Erro de conexao com o banco

Verifique:

- se o container `postgres` esta saudavel
- se o `DATABASE_URL` esta correto
- se a migration foi aplicada

### Prisma Client desatualizado

```bash
yarn db:generate
```

## Documentacao complementar

- [architecture.md](e:/directads/docs/architecture.md)
- [setup.md](e:/directads/docs/setup.md)
- [api.md](e:/directads/docs/api.md)
- [tasks-log.md](e:/directads/docs/tasks-log.md)
