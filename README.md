# DirectAds Backend

Backend em NestJS para a aplicacao DirectAds.

## Visao geral

O projeto esta sendo construído com foco em:

- arquitetura modular
- tipagem forte
- infraestrutura reproduzivel
- autenticacao segura com JWT
- MFA por TOTP com QR code
- documentacao tecnica e operacional clara

No estado atual, o backend possui:

- NestJS com TypeScript
- PostgreSQL via Docker
- Prisma com migrations versionadas
- seed preparada
- healthcheck
- autenticacao JWT com registro, login e rota protegida
- Swagger em `/api/docs`
- entidade principal `Task` com ownership por usuario
- CRUD HTTP completo de `tasks` com filtro por status
- MFA por TOTP compativel com Microsoft Authenticator, Google Authenticator e apps equivalentes
- scripts de validacao e quality gates
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
- `node:crypto`
- `qrcode`

## Arquitetura adotada

O projeto segue uma organizacao modular inspirada em Clean Architecture, separando:

- `application`
- `domain`
- `presentation`
- `infrastructure`

Modulos implementados:

- `health`
- `prisma`
- `auth`
- `tasks`
- `mfa`

Mais detalhes em [architecture.md](e:/directads/docs/architecture.md).

Fluxo visual de autenticacao e MFA:

- [auth-mfa-flow.md](e:/directads/docs/auth-mfa-flow.md)

## Estrutura de pastas

```txt
src/
  modules/
    auth/
    health/
    mfa/
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

O backend em container aplica `yarn db:migrate:deploy` antes de subir a aplicacao.

Servicos expostos:

- API: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

## Variaveis de ambiente

Arquivo base: [`.env.example`](e:/directads/.env.example)

```env
PORT=3000
JWT_SECRET="directads-dev-secret"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/directads?schema=public"
TOTP_APP_NAME="DirectAds"
```

## Banco de dados

- PostgreSQL como banco principal
- Prisma como ORM
- entidade `User` com `email` unico, `passwordHash`, `mfaSecret`, `mfaEnabled` e `mfaConfirmedAt`
- entidade `Task` vinculada a `User` por `userId`
- enum `TaskStatus` com `TODO`, `IN_PROGRESS` e `DONE`

Comandos uteis:

```bash
yarn db:generate
yarn db:migrate:dev
yarn db:migrate:deploy
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
yarn quality:check
yarn db:generate
yarn db:migrate:dev
yarn db:migrate:deploy
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
yarn quality:check
```

## API disponivel

### Healthcheck

- `GET /api/health`

### Autenticacao JWT

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/change-password`
- `GET /api/auth/me`

`GET /api/auth/me` exige:

- `Authorization: Bearer <token>`

`POST /api/auth/change-password` exige:

- `Authorization: Bearer <token>`

### MFA por TOTP

Rotas disponiveis:

- `POST /api/mfa/setup`
- `POST /api/mfa/enable`
- `DELETE /api/mfa`
- `POST /api/mfa/verify-login`

Fluxo implementado:

1. o usuario se registra ou faz login com email e senha
2. autenticado com JWT, chama `POST /api/mfa/setup`
3. o backend devolve `secret`, `otpauthUrl` e `qrCodeDataUrl`
4. o usuario escaneia o QR code no Microsoft Authenticator ou app equivalente
5. o usuario confirma o primeiro codigo em `POST /api/mfa/enable`
6. se quiser remover o segundo fator depois, chama `DELETE /api/mfa`
7. nos proximos logins, `POST /api/auth/login` retorna `mfaRequired=true` e `mfaToken` enquanto o MFA estiver ativo
8. o usuario envia o codigo atual para `POST /api/mfa/verify-login`
9. o backend valida o TOTP e so entao emite o JWT final

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

- autentique em `POST /api/auth/register` ou `POST /api/auth/login`
- se o login responder com `mfaRequired=true`, conclua a segunda etapa em `POST /api/mfa/verify-login`
- copie o `accessToken`
- clique em `Authorize` no Swagger
- informe `Bearer <token>`
- use o mesmo token nas rotas protegidas

## JWT e MFA

Fluxos implementados:

- registro com hash de senha
- login com comparacao segura de senha
- troca de senha autenticada com validacao da senha atual
- emissao de JWT
- rota protegida para usuario autenticado
- setup de MFA por QR code
- ativacao do MFA por confirmacao de codigo TOTP
- remocao autenticada do MFA com limpeza do estado TOTP
- login em duas etapas quando `mfaEnabled=true`

Diagrama do fluxo:

- [auth-mfa-flow.md](e:/directads/docs/auth-mfa-flow.md)

Payload atual do token final:

- `sub`
- `email`

## Dependencias e justificativas

- `@nestjs/*`: base do framework HTTP
- `@prisma/client` e `prisma`: ORM, client tipado e migrations
- `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`: autenticacao JWT
- `bcryptjs`: hash e verificacao de senha
- `@nestjs/swagger` e `swagger-ui-express`: documentacao OpenAPI e UI interativa
- `class-validator` e `class-transformer`: validacao de DTOs
- `node:crypto`: geracao e validacao local dos codigos TOTP
- `qrcode`: geracao do QR code em data URL
- `jest` e `supertest`: testes automatizados
- `eslint` e `prettier`: qualidade estatica
- `husky`, `lint-staged` e `commitlint`: padrao de desenvolvimento

## Dados de avaliacao

Depois de `yarn db:seed`:

- `leona@example.com / secret123`
- `mario@example.com / secret123`
- `carla@example.com / secret123`

O MFA vem desligado na seed para o avaliador poder testar o setup do QR code manualmente.

## Estado atual do roadmap

- concluido: bootstrap do backend
- concluido: Docker + PostgreSQL + Prisma
- concluido: documentacao base
- concluido: autenticacao JWT
- concluido: Swagger
- concluido: modelagem da entidade principal e contratos de repositorio
- concluido: CRUD principal via HTTP
- concluido: MFA por TOTP
- concluido: seed final de avaliacao
- concluido: fortalecimento final de qualidade

## Troubleshooting

### A API nao sobe no Docker

```bash
docker compose up --build
```

Verifique tambem:

- se o container `backend` ficou saudavel
- se o backend conseguiu aplicar `yarn db:migrate:deploy` na inicializacao

### Erro de conexao com o banco

Verifique:

- se o container `postgres` esta saudavel
- se o `DATABASE_URL` esta correto
- se a migration foi aplicada

### Prisma Client desatualizado

```bash
yarn db:generate
```

### A troca de senha foi recusada

Verifique:

- se a requisicao foi feita em `POST /api/auth/change-password`
- se o token JWT do usuario autenticado foi enviado
- se `currentPassword` corresponde exatamente a senha atual
- se `newPassword` e diferente da senha atual

### O login esta pedindo token MFA

Verifique:

- se o usuario ja ativou o MFA em `POST /api/mfa/enable`
- se o `mfaToken` retornado por `POST /api/auth/login` esta sendo reutilizado em `POST /api/mfa/verify-login`
- se o codigo de 6 digitos veio do app autenticador certo

### O MFA nao foi removido

Verifique:

- se a requisicao foi feita em `DELETE /api/mfa`
- se o token JWT do usuario autenticado foi enviado
- se o usuario realmente estava autenticado com a conta correta

### O QR code nao foi aceito

Verifique:

- se `TOTP_APP_NAME` esta configurado
- se o setup foi gerado novamente em `POST /api/mfa/setup`
- se necessario, use o `otpauthUrl` para cadastro manual no app

## Documentacao complementar

- [architecture.md](e:/directads/docs/architecture.md)
- [setup.md](e:/directads/docs/setup.md)
- [api.md](e:/directads/docs/api.md)
- [auth-mfa-flow.md](e:/directads/docs/auth-mfa-flow.md)
- [tasks-log.md](e:/directads/docs/tasks-log.md)

