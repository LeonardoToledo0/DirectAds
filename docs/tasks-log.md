# Tasks Log

## TASK-BE-001 - Bootstrap do projeto backend

- Status: concluida
- Objetivo: estruturar a base inicial do backend com NestJS, arquitetura modular, scripts de qualidade e hooks de desenvolvimento
- Arquivos principais: `src/`, `test/`, `docs/tasks-log.md`, `README.md`, `package.json`, `commitlint.config.cjs`, `.husky/`
- Decisoes: substituir o scaffold padrao por um modulo inicial de healthcheck alinhado a organizacao arquitetural prevista; configurar Husky, lint-staged e commitlint ja no bootstrap para evitar regressões desde o inicio
- Testes: `yarn lint`, `yarn type-check`, `yarn build`, `yarn test`, `yarn test:integration`, `yarn test:cov`, `yarn test:e2e`
- Commit sugerido: `chore(backend): bootstrap backend project with clean architecture structure`

## TASK-BE-002 - Docker + PostgreSQL + Prisma

- Status: concluida
- Objetivo: adicionar ambiente local reproduzivel com Docker, PostgreSQL, Prisma, migration inicial e seed preparada
- Arquivos principais: `Dockerfile`, `docker-compose.yml`, `.env.example`, `prisma/`, `src/prisma/`, `package.json`, `README.md`
- Decisoes: criar schema inicial com a entidade `User` para suportar a proxima etapa de autenticacao; manter seed sem dados sensiveis ate a implementacao dos fluxos de auth; usar Prisma 6.16.2 para manter o fluxo classico de schema, generate e migrate compativel com o projeto atual
- Testes: `yarn lint`, `yarn type-check`, `yarn build`, `yarn test`, `yarn test:integration`, `yarn test:cov`, `yarn test:e2e`, `npx prisma generate`, `npx prisma migrate dev --skip-generate`, `npx prisma db seed`, `docker compose up --build -d backend`, `GET http://localhost:3000/api/health`
- Commit sugerido: `chore(backend): configure docker postgres and prisma`

## TASK-BE-003 - Documentacao base

- Status: concluida
- Objetivo: consolidar documentacao tecnica e operacional do backend no estado atual do projeto
- Arquivos principais: `README.md`, `docs/architecture.md`, `docs/setup.md`, `docs/api.md`, `docs/tasks-log.md`
- Decisoes: documentar apenas o estado real da API atual; manter referencia explicita de que Swagger, JWT e MFA ainda nao foram implementados para evitar desalinhamento entre documentacao e codigo
- Testes: validacao manual dos comandos e rotas documentadas; `yarn lint`, `yarn type-check`, `yarn build`, `yarn test`, `yarn test:integration`, `yarn test:cov`, `yarn test:e2e`
- Commit sugerido: `docs(backend): add architecture setup and execution documentation`

## TASK-BE-004 - Modulo de autenticacao JWT

- Status: concluida
- Objetivo: implementar registro, login, guard JWT e endpoint do usuario autenticado
- Arquivos principais: `src/modules/auth/`, `src/app.module.ts`, `src/main.ts`, `src/app.setup.ts`, `docs/api.md`, `.env.example`
- Decisoes: usar `bcryptjs` para hash de senha; expor apenas dados publicos do usuario nas respostas; manter payload do JWT enxuto com `sub` e `email`; usar um Prisma em memoria no e2e de auth para manter `test:e2e` independente do Postgres
- Testes: `yarn lint`, `yarn type-check`, `yarn build`, `yarn test`, `yarn test:integration`, `yarn test:cov`, `yarn test:e2e`
- Commit sugerido: `feat(backend): implement jwt authentication flow`

## TASK-BE-005 - Swagger

- Status: concluida
- Objetivo: configurar Swagger e documentar os endpoints atuais de health e autenticacao
- Arquivos principais: `src/app.setup.ts`, `src/modules/auth/presentation/controllers/auth.controller.ts`, `src/modules/health/presentation/controllers/health.controller.ts`, `src/modules/auth/application/dto/`, `docs/api.md`, `README.md`
- Decisoes: manter o Swagger sempre habilitado nesta fase; publicar UI em `/api/docs` e JSON em `/api/docs-json`; aplicar bearer auth apenas na rota protegida `GET /api/auth/me`
- Testes: `yarn lint`, `yarn type-check`, `yarn build`, `yarn test`, `yarn test:integration`, `yarn test:cov`, `yarn test:e2e`, smoke test de `GET /api/docs` e validacao de `GET /api/docs-json`
- Commit sugerido: `docs(backend): configure swagger documentation`

## TASK-BE-006 - Entidade principal de negocio

- Status: concluida
- Objetivo: modelar a entidade principal `Task`, criar migration, contratos de repositorio e casos de uso de CRUD sem antecipar a exposicao HTTP da proxima task
- Arquivos principais: `prisma/schema.prisma`, `prisma/migrations/20260330204209_add_tasks_entity/`, `src/modules/tasks/`, `src/app.module.ts`, `README.md`, `docs/architecture.md`, `docs/api.md`
- Decisoes: usar `Task` como entidade principal do MVP com ownership explicito por `userId`; adotar enum de status `TODO`, `IN_PROGRESS` e `DONE`; concentrar o acesso a persistencia em `PrismaTaskRepository`; preparar DTOs e use cases agora e deixar os endpoints REST para a TASK-BE-007
- Testes: `yarn db:generate`, `yarn db:migrate:dev --name add_tasks_entity`, `yarn lint`, `yarn type-check`, `yarn build`, `yarn test`, `yarn test:integration`, `yarn test:cov`, `yarn test:e2e`
- Commit sugerido: `feat(backend): add main domain entity and repository contracts`

## TASK-BE-007 - CRUD completo

- Status: concluida
- Objetivo: expor o CRUD completo de `tasks` por HTTP com JWT, ownership, Swagger e cobertura ponta a ponta
- Arquivos principais: `src/modules/tasks/presentation/controllers/tasks.controller.ts`, `src/modules/tasks/application/dto/task-response.dto.ts`, `src/modules/tasks/tasks.module.ts`, `test/tasks.e2e-spec.ts`, `test/app.e2e-spec.ts`, `README.md`, `docs/api.md`
- Decisoes: proteger todas as rotas de `tasks` com JWT; retornar `404` quando a task nao pertence ao usuario autenticado; manter filtro por `status` na listagem; permitir limpeza explicita de `description` com `null` no update; documentar todas as rotas no Swagger em `/api/docs`
- Testes: `yarn lint`, `yarn type-check`, `yarn build`, `yarn test`, `yarn test:integration`, `yarn test:cov`, `yarn test:e2e`
- Commit sugerido: `feat(backend): implement full crud for main entity`

## TASK-BE-008 - MFA Microsoft

- Status: concluida
- Objetivo: adicionar fluxo Microsoft MFA desacoplado, com provider configuravel, state assinada, segunda etapa de verificacao e emissao de JWT local
- Arquivos principais: `src/modules/mfa/`, `prisma/schema.prisma`, `prisma/migrations/20260330221500_add_microsoft_account_link/`, `.env.example`, `README.md`, `docs/api.md`, `docs/architecture.md`
- Decisoes: usar um provider Microsoft mockado e configuravel por `.env` para manter o projeto executavel offline; vincular a identidade Microsoft em `User.microsoftAccountId`; criar automaticamente o usuario local quando a identidade Microsoft ainda nao existir; proteger o retorno do fluxo com `state` assinada em JWT e exigir `verificationCode` como segunda etapa MFA
- Testes: `yarn db:generate`, `npx prisma migrate deploy`, `yarn lint`, `yarn type-check`, `yarn build`, `yarn test`, `yarn test:integration`, `yarn test:cov`, `yarn test:e2e`
- Commit sugerido: `feat(backend): add microsoft mfa authentication flow`
