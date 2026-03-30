# DirectAds Backend

Backend em NestJS para o teste tecnico da aplicacao DirectAds.

## Status atual

O projeto esta na etapa de infraestrutura inicial de banco e execucao local.

Nesta etapa ja existe:

- base em NestJS com TypeScript
- modulo inicial de healthcheck
- estrutura inicial alinhada a uma organizacao modular
- Prisma configurado com schema inicial
- PostgreSQL preparado para execucao em Docker
- migration inicial versionada
- seed inicial preparada
- scripts de qualidade
- hooks de commit com Husky

## Stack

- NestJS
- TypeScript
- PostgreSQL
- Prisma
- Docker
- Docker Compose
- Jest
- ESLint
- Prettier
- Husky
- lint-staged
- commitlint

## Scripts principais

```bash
yarn start:dev
yarn lint
yarn type-check
yarn build
yarn test
yarn test:cov
yarn test:e2e
yarn db:generate
yarn db:migrate:dev
yarn db:seed
```

## Ambiente

Copie `.env.example` para `.env` e ajuste os valores se necessario.

```bash
copy .env.example .env
```

Variaveis principais:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/directads?schema=public"
```

## Subindo com Docker

Banco de dados:

```bash
docker-compose up -d postgres
```

Aplicacao e banco:

```bash
docker-compose up --build
```

## Prisma

Gerar client:

```bash
yarn db:generate
```

Criar/aplicar migrations em ambiente local:

```bash
yarn db:migrate:dev
```

Executar seed:

```bash
yarn db:seed
```

## Endpoint disponivel nesta fase

```txt
GET /api/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "service": "directads-backend",
  "timestamp": "2026-03-30T00:00:00.000Z"
}
```

## Proximas etapas

- documentacao base completa
- autenticacao JWT
- Swagger
- CRUD principal
- MFA Microsoft
