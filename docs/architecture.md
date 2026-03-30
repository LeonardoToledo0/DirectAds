# Architecture

## Objetivo

Documentar a base arquitetural do backend DirectAds no estado atual do projeto.

## Direcao arquitetural

O backend segue uma organizacao modular inspirada em Clean Architecture para manter:

- regra de negocio fora de controllers
- infraestrutura isolada
- casos de uso explicitos
- baixo acoplamento entre framework e dominio
- facilidade de teste e evolucao

## Camadas

### Presentation

Responsavel por:

- receber requisicoes HTTP
- expor endpoints
- delegar execucao para casos de uso
- serializar respostas
- documentar contratos no Swagger

No estado atual:

- [health.controller.ts](e:/directads/src/modules/health/presentation/controllers/health.controller.ts)
- [auth.controller.ts](e:/directads/src/modules/auth/presentation/controllers/auth.controller.ts)
- [tasks.controller.ts](e:/directads/src/modules/tasks/presentation/controllers/tasks.controller.ts)
- [mfa.controller.ts](e:/directads/src/modules/mfa/presentation/controllers/mfa.controller.ts)

### Application

Responsavel por:

- orquestrar os fluxos da aplicacao
- centralizar casos de uso
- coordenar regras de entrada e saida

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
- [setup-totp-mfa.use-case.ts](e:/directads/src/modules/mfa/application/use-cases/setup-totp-mfa.use-case.ts)
- [enable-totp-mfa.use-case.ts](e:/directads/src/modules/mfa/application/use-cases/enable-totp-mfa.use-case.ts)
- [disable-totp-mfa.use-case.ts](e:/directads/src/modules/mfa/application/use-cases/disable-totp-mfa.use-case.ts)
- [verify-totp-login.use-case.ts](e:/directads/src/modules/mfa/application/use-cases/verify-totp-login.use-case.ts)

### Domain

Responsavel por:

- contratos de dominio
- entidades
- invariantes

No estado atual:

- [health-status.entity.ts](e:/directads/src/modules/health/domain/entities/health-status.entity.ts)
- [authenticated-user.interface.ts](e:/directads/src/modules/auth/domain/interfaces/authenticated-user.interface.ts)
- [task.entity.ts](e:/directads/src/modules/tasks/domain/entities/task.entity.ts)
- [task-repository.interface.ts](e:/directads/src/modules/tasks/domain/interfaces/task-repository.interface.ts)
- [totp-provider.interface.ts](e:/directads/src/modules/mfa/domain/interfaces/totp-provider.interface.ts)

### Infrastructure

Responsavel por:

- Prisma
- conexao com banco
- implementacao concreta de dependencias externas

No estado atual:

- [prisma.service.ts](e:/directads/src/prisma/prisma.service.ts)
- [prisma.module.ts](e:/directads/src/prisma/prisma.module.ts)
- [prisma-task.repository.ts](e:/directads/src/modules/tasks/infrastructure/repositories/prisma-task.repository.ts)
- [otplib-totp.provider.ts](e:/directads/src/modules/mfa/infrastructure/providers/otplib-totp.provider.ts)
- [totp.utils.ts](e:/directads/src/modules/mfa/infrastructure/providers/totp.utils.ts)

## Organizacao de modulos

Hoje os modulos implementados sao:

- `health`
- `prisma`
- `auth`
- `tasks`
- `mfa`

### Modulo auth

Funcao:

- registrar usuarios
- autenticar por email e senha
- emitir JWT
- retornar um token temporario de segunda etapa quando o MFA estiver habilitado
- expor o usuario autenticado

### Modulo tasks

Funcao:

- expor o CRUD completo do dominio principal
- preservar ownership por usuario em todas as operacoes
- documentar o contrato HTTP no Swagger

### Modulo mfa

Funcao:

- gerar secret TOTP por usuario autenticado
- devolver QR code e `otpauthUrl` para cadastro no app autenticador
- confirmar o primeiro codigo TOTP e ativar MFA
- remover o MFA limpando o estado persistido do segundo fator
- concluir o login em segunda etapa quando `mfaEnabled=true`

## Bootstrap da aplicacao

Arquivo principal:

- [main.ts](e:/directads/src/main.ts)

Configuracoes atuais:

- prefixo global `/api`
- `ValidationPipe` global
- integracao do ciclo de vida com Prisma
- Swagger em `/api/docs`

## Banco de dados

Arquivo principal do schema:

- [schema.prisma](e:/directads/prisma/schema.prisma)

Modelagem atual:

- tabela `users`
- tabela `tasks`
- UUID como identificador
- `email` com unicidade
- `User.mfaSecret`, `User.mfaEnabled` e `User.mfaConfirmedAt` para o fluxo TOTP
- `Task.userId` como ownership explicito
- enum `TaskStatus` para o ciclo principal da entidade
- timestamps de criacao e atualizacao

## Decisoes arquiteturais ja tomadas

- Prisma fica isolado em um modulo proprio
- o backend sobe com ambiente reproduzivel via Docker
- o projeto ja nasce com testes e quality gates
- o pipeline de GitHub Actions executa o mesmo `yarn quality:check` em push e pull request
- a documentacao acompanha a evolucao por task
- o CRUD principal aplica ownership no caso de uso e no acesso ao repositorio
- o contrato HTTP do dominio principal e documentado diretamente no Swagger do modulo
- o MFA usa TOTP compativel com Microsoft Authenticator, mantendo o backend independente de login federado externo
- a segunda etapa de login usa um `mfaToken` temporario assinado para evitar emissao prematura do JWT final
- o container do backend aplica migrations automaticamente na inicializacao para reduzir atrito na avaliacao


## Diagramas de apoio

- Fluxo visual de cadastro, login e MFA: [auth-mfa-flow.md](e:/directads/docs/auth-mfa-flow.md)

## Estado final da arquitetura

- modulos principais implementados e documentados
- autenticacao JWT pronta para uso
- dominio principal com CRUD completo e ownership
- MFA por TOTP com QR code funcional
- seed de avaliacao reproduzivel
- quality gates automatizados e validados

