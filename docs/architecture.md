# Architecture

## Objetivo

Documentar a base arquitetural do backend DirectAds no estado atual do projeto.

## Direção arquitetural

O backend está sendo estruturado com uma organização modular inspirada em Clean Architecture.

O objetivo é manter:

- regra de negócio fora de controllers
- infraestrutura isolada
- casos de uso explícitos
- baixo acoplamento entre framework e domínio
- facilidade de teste e evolução

## Camadas

### Presentation

Responsável por:

- receber requisições HTTP
- expor endpoints
- delegar execução para casos de uso
- serializar respostas

No estado atual:

- [health.controller.ts](e:/directads/src/modules/health/presentation/controllers/health.controller.ts)
- [auth.controller.ts](e:/directads/src/modules/auth/presentation/controllers/auth.controller.ts)

### Application

Responsável por:

- orquestrar os fluxos da aplicação
- centralizar casos de uso
- coordenar regras de entrada e saída

No estado atual:

- [get-health-status.use-case.ts](e:/directads/src/modules/health/application/use-cases/get-health-status.use-case.ts)
- [register-user.use-case.ts](e:/directads/src/modules/auth/application/use-cases/register-user.use-case.ts)
- [login-user.use-case.ts](e:/directads/src/modules/auth/application/use-cases/login-user.use-case.ts)
- [get-authenticated-user.use-case.ts](e:/directads/src/modules/auth/application/use-cases/get-authenticated-user.use-case.ts)
- [create-task.use-case.ts](e:/directads/src/modules/tasks/application/use-cases/create-task.use-case.ts)
- [list-tasks.use-case.ts](e:/directads/src/modules/tasks/application/use-cases/list-tasks.use-case.ts)
- [get-task-by-id.use-case.ts](e:/directads/src/modules/tasks/application/use-cases/get-task-by-id.use-case.ts)
- [update-task.use-case.ts](e:/directads/src/modules/tasks/application/use-cases/update-task.use-case.ts)
- [delete-task.use-case.ts](e:/directads/src/modules/tasks/application/use-cases/delete-task.use-case.ts)

### Domain

Responsável por:

- contratos de domínio
- entidades
- invariantes

No estado atual:

- [health-status.entity.ts](e:/directads/src/modules/health/domain/entities/health-status.entity.ts)
- [authenticated-user.interface.ts](e:/directads/src/modules/auth/domain/interfaces/authenticated-user.interface.ts)
- [task.entity.ts](e:/directads/src/modules/tasks/domain/entities/task.entity.ts)
- [task-repository.interface.ts](e:/directads/src/modules/tasks/domain/interfaces/task-repository.interface.ts)

### Infrastructure

Responsável por:

- Prisma
- conexão com banco
- implementação concreta de dependências externas

No estado atual:

- [prisma.service.ts](e:/directads/src/prisma/prisma.service.ts)
- [prisma.module.ts](e:/directads/src/prisma/prisma.module.ts)
- [prisma-task.repository.ts](e:/directads/src/modules/tasks/infrastructure/repositories/prisma-task.repository.ts)

## Organização de módulos

O projeto está estruturado para crescer por domínio.

Hoje os módulos implementados são:

- `health`
- `prisma`
- `auth`
- `tasks`

### Módulo health

Função:

- validar que a aplicação sobe corretamente
- servir como primeiro fluxo funcional

### Módulo prisma

Função:

- centralizar o acesso ao Prisma Client
- expor a dependência de banco de forma global

### Módulo auth

Função:

- registrar e autenticar usuários
- proteger rotas privadas com JWT
- expor o usuário autenticado

### Módulo tasks

Função:

- modelar o domínio principal do MVP
- concentrar contratos de repositório e casos de uso do CRUD
- preservar ownership por usuário antes da exposição HTTP

## Bootstrap da aplicação

Arquivo principal:

- [main.ts](e:/directads/src/main.ts)

Configurações atuais:

- prefixo global `/api`
- `ValidationPipe` global
- integração do ciclo de vida com Prisma
- Swagger em `/api/docs`

## Banco de dados

Arquivo principal do schema:

- [schema.prisma](e:/directads/prisma/schema.prisma)

Modelagem atual:

- tabela `users`
- tabela `tasks`
- UUID como identificador
- `email` com unicidade
- `Task.userId` como ownership explícito
- enum `TaskStatus` para o ciclo principal da entidade
- timestamps de criação e atualização

## Decisões arquiteturais já tomadas

- Prisma fica isolado em um módulo próprio
- o backend sobe com ambiente reproduzível via Docker
- o projeto já nasce com testes e quality gates
- a documentação acompanha a evolução por task
- o CRUD principal está sendo preparado em duas etapas: modelagem interna primeiro, API HTTP depois

## Próximos passos arquiteturais

- expor endpoints REST do módulo `tasks`
- documentar o CRUD principal no Swagger
- validar ownership ponta a ponta na camada HTTP
- introduzir integração de MFA Microsoft
