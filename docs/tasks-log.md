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

## TASK-BE-008 - MFA por TOTP com QR code

- Status: concluida
- Objetivo: substituir o fluxo mockado anterior por MFA real de aplicacao com secret TOTP, QR code, ativacao por codigo de 6 digitos e segunda etapa de login
- Arquivos principais: `src/modules/mfa/`, `src/modules/auth/`, `prisma/schema.prisma`, `prisma/migrations/`, `.env.example`, `README.md`, `docs/api.md`, `docs/architecture.md`
- Decisoes: usar TOTP padrao compativel com Microsoft Authenticator e apps equivalentes; mover o MFA para o fluxo correto de cadastro/configuracao e login em duas etapas; gerar `qrCodeDataUrl` e `otpauthUrl` no backend; guardar `mfaSecret`, `mfaEnabled` e `mfaConfirmedAt` no usuario; emitir um `mfaToken` temporario no login antes da segunda etapa
- Testes: `yarn db:generate`, `yarn lint`, `yarn type-check`, `yarn build`, `yarn test`, `yarn test:integration`, `yarn test:cov`, `yarn test:e2e`
- Commit sugerido: `feat(backend): implement totp mfa flow with qr code`

## TASK-BE-009 - Seed + dados de avaliacao

- Status: concluida
- Objetivo: criar seed idempotente com usuarios e tasks uteis para avaliacao e documentar sua execucao
- Arquivos principais: `prisma/seed.ts`, `test/seed.integration-spec.ts`, `docs/setup.md`, `README.md`, `docs/tasks-log.md`
- Decisoes: usar upsert para tornar a seed reproduzivel; popular tres usuarios de avaliacao com senha conhecida `secret123`; manter o MFA desligado na seed para o avaliador poder executar o setup TOTP manualmente; distribuir tasks com os tres status do dominio para facilitar demonstracao manual da API
- Testes: `yarn db:seed`, `yarn lint`, `yarn type-check`, `yarn build`, `yarn test`, `yarn test:integration`, `yarn test:cov`, `yarn test:e2e`
- Commit sugerido: `chore(backend): add database seed for evaluation`

## TASK-BE-010 - Fortalecimento final de qualidade

- Status: concluida
- Objetivo: revisar consistencia final da entrega, endurecer o ambiente Docker, padronizar scripts de validacao e alinhar a documentacao ao estado final do backend
- Arquivos principais: `package.json`, `Dockerfile`, `docker-compose.yml`, `README.md`, `docs/setup.md`, `docs/architecture.md`, `docs/api.md`, `docs/tasks-log.md`
- Decisoes: adicionar script `yarn quality:check` para consolidar os quality gates; adicionar `yarn db:migrate:deploy` para ambiente nao interativo; fazer o container do backend aplicar migrations antes do start; explicitar as variaveis reais de JWT, banco e TOTP no `docker-compose`; adicionar healthcheck do backend e encerrar a documentacao com o roadmap completo como concluido
- Testes: `yarn lint`, `yarn type-check`, `yarn build`, `yarn test`, `yarn test:integration`, `yarn test:cov`, `yarn test:e2e`, `yarn quality:check`, `docker compose up --build -d backend`, `GET http://localhost:3000/api/health`, `GET http://localhost:3000/api/docs-json`
- Commit sugerido: `chore(backend): finalize backend quality gates and delivery readiness`


## TASK-BE-011 - Troca de senha do usuario autenticado

- Status: concluida
- Objetivo: implementar endpoint protegido para troca de senha com validacao da senha atual, persistencia do novo hash e documentacao completa do fluxo
- Arquivos principais: `src/modules/auth/`, `test/auth.e2e-spec.ts`, `test/auth.integration-spec.ts`, `test/app.e2e-spec.ts`, `README.md`, `docs/api.md`, `docs/architecture.md`, `docs/setup.md`, `AGENTS.md`
- Decisoes: usar um use case explicito para a troca de senha; manter o endpoint em `auth` por se tratar de manutencao da credencial principal do usuario autenticado; retornar apenas os dados publicos do usuario apos a troca; invalidar a senha anterior ao atualizar o hash persistido; exigir `currentPassword` e `newPassword` no boundary para evitar atualizacao cega da credencial
- Testes: `yarn lint`, `yarn type-check`, `yarn build`, `yarn test`, `yarn test:integration`, `yarn test:cov`, `yarn test:e2e`, `yarn quality:check`
- Endpoints afetados: `POST /api/auth/change-password`
- Commit realizado: `399dbe1` - `feat(backend): add authenticated password change flow`
- Commit sugerido: `feat(backend): add authenticated password change flow`


## TASK-BE-012 - Remocao do MFA do usuario autenticado

- Status: concluida
- Objetivo: implementar endpoint protegido para desabilitar o MFA, limpar o estado TOTP persistido e documentar o comportamento atualizado do login
- Arquivos principais: `src/modules/mfa/`, `test/mfa.e2e-spec.ts`, `test/mfa.integration-spec.ts`, `test/app.e2e-spec.ts`, `README.md`, `docs/api.md`, `docs/architecture.md`, `docs/setup.md`
- Decisoes: usar `DELETE /api/mfa` como contrato direto para remocao do segundo fator; limpar `mfaSecret`, `mfaEnabled` e `mfaConfirmedAt` em uma unica operacao; retornar `TotpMfaStatusDto` para manter o contrato enxuto e alinhado ao estado de MFA; validar em e2e que o login volta a nao exigir a segunda etapa apos a remocao
- Testes: `yarn lint`, `yarn type-check`, `yarn build`, `yarn test`, `yarn test:integration`, `yarn test:cov`, `yarn test:e2e`, `yarn quality:check`
- Endpoints afetados: `DELETE /api/mfa`
- Commit realizado: `354c2d2` - `feat(backend): add authenticated mfa removal flow`
- Commit sugerido: `feat(backend): add authenticated mfa removal flow`


## TASK-BE-013 - Diagrama do fluxo de cadastro, login e MFA

- Status: concluida
- Objetivo: documentar visualmente o fluxo de cadastro, configuracao do MFA por TOTP, login em duas etapas e remocao do segundo fator
- Arquivos principais: `docs/auth-mfa-flow.md`, `README.md`, `docs/api.md`, `docs/setup.md`, `docs/tasks-log.md`
- Decisoes: usar Mermaid em Markdown para manter o diagrama versionado junto ao codigo; separar o desenho em um arquivo proprio para facilitar referencia cruzada no README, API e setup; registrar no log os commits efetivos das tasks 11, 12 e 13 para manter a trilha auditavel
- Testes: validacao manual da renderizacao e consistencia do fluxo documentado; `yarn lint`, `yarn type-check`, `yarn build`, `yarn test`, `yarn test:integration`, `yarn test:cov`, `yarn test:e2e`, `yarn quality:check`
- Endpoints afetados: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/change-password`, `POST /api/mfa/setup`, `POST /api/mfa/enable`, `POST /api/mfa/verify-login`, `DELETE /api/mfa`
- Commit sugerido: `docs(backend): add auth and mfa flow diagram`


## TASK-BE-014 - Limpeza estrutural e CI/CD

- Status: concluida
- Objetivo: remover diretórios vazios e arquivos `.gitkeep` desnecessários, adicionar CI no GitHub Actions e preparar a publicação do estado validado no repositório remoto
- Arquivos principais: `.github/workflows/backend-ci.yml`, `README.md`, `docs/architecture.md`, `docs/tasks-log.md`, `AGENTS.md`
- Decisoes: remover apenas diretórios realmente vazios e `.gitkeep` sem função estrutural; reaproveitar o script `yarn quality:check` como contrato único do pipeline; configurar o workflow para rodar em `push` e `pull_request` com Node.js 22 e cache de Yarn
- Testes: `yarn lint`, `yarn type-check`, `yarn build`, `yarn test`, `yarn test:integration`, `yarn test:cov`, `yarn test:e2e`, `yarn quality:check`
- Endpoints afetados: nenhum
- Commit realizado: `21e1e41` - `chore(backend): add github actions quality pipeline`
- Publicacao: branch `master` publicada em `origin/master` no repositorio `https://github.com/LeonardoToledo0/DirectAds.git`
- Commit sugerido: `chore(backend): add github actions quality pipeline`
