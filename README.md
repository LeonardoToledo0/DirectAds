# DirectAds Backend

Backend em NestJS para o teste técnico da aplicação DirectAds.

## Visão geral

Este repositório contém a API backend do projeto, construída com foco em:

- arquitetura modular
- tipagem forte
- infraestrutura reproduzível
- base pronta para evolução incremental
- documentação técnica e operacional clara

No estado atual, o projeto já possui:

- NestJS com TypeScript
- PostgreSQL via Docker
- Prisma configurado com migration inicial
- seed preparada
- endpoint de healthcheck
- lint, build e testes automatizados
- Husky, lint-staged e commitlint

## Stack utilizada

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

## Arquitetura adotada

O projeto segue uma organização modular inspirada em Clean Architecture, mantendo separação entre:

- `application`: casos de uso e orquestração
- `domain`: contratos e entidades de domínio
- `presentation`: controllers e camada HTTP
- `infrastructure`: integrações e acesso a banco

Hoje a base implementada inclui:

- módulo `health` como ponto inicial funcional
- módulo global `prisma` para centralizar a conexão com banco
- `main.ts` com prefixo global `/api` e `ValidationPipe`

Mais detalhes estão em [architecture.md](e:/directads/docs/architecture.md).

## Estrutura de pastas

```txt
src/
  modules/
    health/
      application/
      domain/
      presentation/
      health.module.ts
  prisma/
    prisma.module.ts
    prisma.service.ts
  app.module.ts
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

test/
  app.e2e-spec.ts
  health.integration-spec.ts
  prisma.integration-spec.ts
```

## Como rodar localmente

### 1. Instalar dependências

```bash
yarn install
```

### 2. Criar o arquivo de ambiente

No Windows:

```bash
copy .env.example .env
```

Em ambientes Unix:

```bash
cp .env.example .env
```

### 3. Subir o PostgreSQL

```bash
docker compose up -d postgres
```

### 4. Gerar o Prisma Client

```bash
yarn db:generate
```

### 5. Aplicar a migration

```bash
yarn db:migrate:dev
```

### 6. Rodar a seed

```bash
yarn db:seed
```

### 7. Iniciar a API em modo de desenvolvimento

```bash
yarn start:dev
```

## Como rodar com Docker

Para subir backend e banco juntos:

```bash
docker compose up --build
```

Serviços expostos:

- API: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

## Variáveis de ambiente

Arquivo base: [`.env.example`](e:/directads/.env.example)

Variáveis atuais:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/directads?schema=public"
```

## Banco de dados

### Banco oficial

- PostgreSQL

### ORM

- Prisma

### Comandos úteis

Gerar client:

```bash
yarn db:generate
```

Criar/aplicar migrations:

```bash
yarn db:migrate:dev
```

Executar seed:

```bash
yarn db:seed
```

Schema atual:

- entidade `User`
- `id` UUID
- `email` único
- timestamps automáticos

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

Validações executadas no projeto:

- unitários
- integração
- e2e
- cobertura com threshold global de 100%

Comandos:

```bash
yarn test
yarn test:integration
yarn test:cov
yarn test:e2e
```

## API disponível neste momento

### Healthcheck

`GET /api/health`

Exemplo:

```txt
http://localhost:3000/api/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "service": "directads-backend",
  "timestamp": "2026-03-30T00:00:00.000Z"
}
```

Documentação atual da API: [api.md](e:/directads/docs/api.md)

## Swagger

O Swagger ainda não foi configurado.

Planejamento atual:

- rota futura esperada: `/api/docs`
- configuração prevista na task de Swagger

## Autenticação JWT

Ainda não implementada.

Está prevista para as próximas tasks do projeto.

## MFA Microsoft

Ainda não implementado.

Está previsto no roadmap do backend e será integrado em etapa própria.

## Dependências e justificativas

- `@nestjs/*`: base do framework HTTP e do container de dependências
- `@prisma/client` e `prisma`: ORM, migrations e acesso tipado ao banco
- `class-validator` e `class-transformer`: suporte ao `ValidationPipe` e futuros DTOs
- `jest` e `supertest`: testes unitários, integração e e2e
- `eslint` e `prettier`: padronização e qualidade estática
- `husky`, `lint-staged` e `commitlint`: qualidade e consistência no fluxo de commits

## Estado atual do roadmap

- concluído: bootstrap do backend
- concluído: Docker + PostgreSQL + Prisma
- concluído: documentação base
- próximo: autenticação JWT
- depois: Swagger
- depois: CRUD principal
- depois: MFA Microsoft

## Troubleshooting

### A API não sobe no Docker

Verifique se o Docker Desktop está em execução e tente:

```bash
docker compose up --build
```

### Erro de conexão com o banco

Confirme:

- se o container `postgres` está saudável
- se o `DATABASE_URL` no `.env` está correto
- se a migration já foi aplicada

### Prisma Client desatualizado

Rode:

```bash
yarn db:generate
```

## Documentação complementar

- [architecture.md](e:/directads/docs/architecture.md)
- [setup.md](e:/directads/docs/setup.md)
- [api.md](e:/directads/docs/api.md)
- [tasks-log.md](e:/directads/docs/tasks-log.md)
