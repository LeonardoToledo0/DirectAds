# DirectAds Backend

Backend em NestJS para o teste técnico da aplicação DirectAds.

## Status atual

O projeto está em fase de bootstrap arquitetural.

Nesta etapa já existe:

- base em NestJS com TypeScript
- módulo inicial de healthcheck
- estrutura inicial alinhada a uma organização modular
- scripts de qualidade
- hooks de commit com Husky

## Stack

- NestJS
- TypeScript
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
```

## Endpoint disponível nesta fase

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

## Próximas etapas

- Docker + PostgreSQL + Prisma
- documentação base completa
- autenticação JWT
- Swagger
- CRUD principal
- MFA Microsoft
