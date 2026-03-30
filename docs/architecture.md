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

### Application

Responsável por:

- orquestrar os fluxos da aplicação
- centralizar casos de uso
- coordenar regras de entrada e saída

No estado atual:

- [get-health-status.use-case.ts](e:/directads/src/modules/health/application/use-cases/get-health-status.use-case.ts)

### Domain

Responsável por:

- contratos de domínio
- entidades
- invariantes

No estado atual:

- [health-status.entity.ts](e:/directads/src/modules/health/domain/entities/health-status.entity.ts)

### Infrastructure

Responsável por:

- Prisma
- conexão com banco
- implementação concreta de dependências externas

No estado atual:

- [prisma.service.ts](e:/directads/src/prisma/prisma.service.ts)
- [prisma.module.ts](e:/directads/src/prisma/prisma.module.ts)

## Organização de módulos

O projeto está estruturado para crescer por domínio.

Hoje os módulos implementados são:

- `health`
- `prisma`

### Módulo health

Função:

- validar que a aplicação sobe corretamente
- servir como primeiro fluxo funcional

### Módulo prisma

Função:

- centralizar o acesso ao Prisma Client
- expor a dependência de banco de forma global

## Bootstrap da aplicação

Arquivo principal:

- [main.ts](e:/directads/src/main.ts)

Configurações atuais:

- prefixo global `/api`
- `ValidationPipe` global
- integração do ciclo de vida com Prisma

## Banco de dados

Arquivo principal do schema:

- [schema.prisma](e:/directads/prisma/schema.prisma)

Modelagem inicial:

- tabela `users`
- UUID como identificador
- `email` com unicidade
- timestamps de criação e atualização

## Decisões arquiteturais já tomadas

- Prisma fica isolado em um módulo próprio
- o backend sobe com ambiente reproduzível via Docker
- o projeto já nasce com testes e quality gates
- a documentação acompanha a evolução por task

## Próximos passos arquiteturais

- introduzir módulo de autenticação JWT
- criar DTOs e contratos de entrada
- adicionar Swagger
- evoluir para CRUD do domínio principal
- introduzir integração de MFA Microsoft