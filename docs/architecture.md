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
- [tasks.controller.ts](e:/directads/src/modules/tasks/presentation/controllers/tasks.controller.ts)
- [microsoft-mfa.controller.ts](e:/directads/src/modules/mfa/presentation/controllers/microsoft-mfa.controller.ts)

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
- [start-microsoft-mfa.use-case.ts](e:/directads/src/modules/mfa/application/use-cases/start-microsoft-mfa.use-case.ts)
- [verify-microsoft-mfa.use-case.ts](e:/directads/src/modules/mfa/application/use-cases/verify-microsoft-mfa.use-case.ts)

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
- [microsoft-mfa-provider.interface.ts](e:/directads/src/modules/mfa/domain/interfaces/microsoft-mfa-provider.interface.ts)

### Infrastructure

Responsável por:

- Prisma
- conexão com banco
- implementação concreta de dependências externas

No estado atual:

- [prisma.service.ts](e:/directads/src/prisma/prisma.service.ts)
- [prisma.module.ts](e:/directads/src/prisma/prisma.module.ts)
- [prisma-task.repository.ts](e:/directads/src/modules/tasks/infrastructure/repositories/prisma-task.repository.ts)
- [mock-microsoft-mfa.provider.ts](e:/directads/src/modules/mfa/infrastructure/providers/mock-microsoft-mfa.provider.ts)

## Organização de módulos

O projeto está estruturado para crescer por domínio.

Hoje os módulos implementados são:

- `health`
- `prisma`
- `auth`
- `tasks`
- `mfa`

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

- expor o CRUD completo do domínio principal
- preservar ownership por usuário em todas as operações
- documentar o contrato HTTP no Swagger

### Módulo mfa

Função:

- iniciar o fluxo federado Microsoft
- validar o retorno do provider e a segunda etapa MFA
- vincular a identidade Microsoft ao usuário local
- emitir o JWT local após a autenticação complementar

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
- `User.microsoftAccountId` para vincular a identidade Microsoft
- `Task.userId` como ownership explícito
- enum `TaskStatus` para o ciclo principal da entidade
- timestamps de criação e atualização

## Decisões arquiteturais já tomadas

- Prisma fica isolado em um módulo próprio
- o backend sobe com ambiente reproduzível via Docker
- o projeto já nasce com testes e quality gates
- a documentação acompanha a evolução por task
- o CRUD principal aplica ownership no caso de uso e no acesso ao repositório
- o contrato HTTP do domínio principal é documentado diretamente no Swagger do módulo
- o fluxo Microsoft MFA usa provider desacoplado para permitir troca futura pelo SDK real sem afetar os casos de uso
- o ambiente local usa provider mockado e reproduzível para manter os testes automatizados estáveis
- o container do backend aplica migrations automaticamente na inicialização para reduzir atrito na avaliação

## Estado final da arquitetura

- módulos principais implementados e documentados
- autenticação JWT pronta para uso
- domínio principal com CRUD completo e ownership
- fluxo Microsoft MFA funcional para ambiente local e testes
- seed de avaliação reproduzível
- quality gates automatizados e validados
