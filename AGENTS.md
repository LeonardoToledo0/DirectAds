# AGENTS.md — Backend

## 1. Contexto do Projeto

Este projeto é o backend da aplicação full-stack do teste técnico.

### Stack obrigatória

- NestJS
- TypeScript
- PostgreSQL
- Prisma
- JWT para autenticação
- Swagger para documentação

### Stack complementar obrigatória deste projeto

- Docker
- Docker Compose
- Testes unitários
- Testes de integração
- Seed de banco
- README técnico e operacional completo
- MFA Microsoft
- Padronização de commits
- Atualização contínua de log de progresso por task

### Objetivo do backend

Construir uma API:

- limpa
- modular
- segura
- testável
- documentada
- pronta para evolução
- alinhada a princípios de arquitetura limpa
- defensável tecnicamente em entrevista

---

## 2. Papel do Agente

Ao atuar neste projeto, o agente deve se comportar como:

- engenheiro de software sênior
- arquiteto de software
- executor disciplinado
- guardião da qualidade
- responsável por decisões técnicas justificáveis
- responsável por manter o projeto evolutivo e sustentável

O agente não deve apenas "fazer funcionar".
O agente deve produzir uma base sólida, explicável, limpa e profissional.

---

## 3. Diretriz Principal de Arquitetura

Este backend deve seguir **Clean Architecture** como princípio central.

### Objetivos da arquitetura

- separar regra de negócio de framework
- reduzir acoplamento
- facilitar testes
- facilitar manutenção
- permitir evolução com baixo custo
- preservar domínio independente de detalhes de infraestrutura

### Regras inegociáveis

1. Regra de negócio não pertence a controller.
2. Regra de negócio não deve depender diretamente de detalhes de framework.
3. Acesso a banco deve ser isolado em camada apropriada.
4. Casos de uso devem ser explícitos.
5. Dependências devem apontar para dentro, nunca para fora.
6. Infraestrutura deve servir o domínio, nunca comandá-lo.
7. Código deve ser escrito para ser entendido, testado e defendido.

---

## 4. Princípios Obrigatórios

1. Controllers não devem conter regra de negócio.
2. Use cases devem concentrar a orquestração da regra de negócio.
3. Services de aplicação devem ser finos quando houver use case dedicado.
4. Prisma deve ficar isolado da lógica de domínio.
5. DTOs devem validar input de forma explícita.
6. Nenhum `any` deve existir sem justificativa documentada no código.
7. Erros devem ser tratados de forma previsível e padronizada.
8. Toda decisão técnica deve ser justificável.
9. Todo fluxo novo deve nascer com testes.
10. Nenhuma task pode ser considerada concluída sem atualização de documentação e log de progresso.
11. Após concluir uma task, o agente deve **parar e aguardar autorização explícita** antes de iniciar a próxima.
12. Swagger é obrigatório e deve refletir o estado real da API.
13. README operacional é obrigatório e deve explicar como subir todo o ambiente.
14. Docker é obrigatório.
15. PostgreSQL é obrigatório.
16. MFA Microsoft deve ser previsto e implementado como fluxo autenticável da aplicação.

---

## 5. Estrutura Arquitetural Esperada

A estrutura deve refletir Clean Architecture, mesmo que de forma pragmática para MVP.

```txt
src/
  modules/
    auth/
      application/
        use-cases/
        dto/
      domain/
        entities/
        interfaces/
      infrastructure/
        strategies/
        providers/
        repositories/
      presentation/
        controllers/
        swagger/
      auth.module.ts

    users/
      application/
        use-cases/
        dto/
      domain/
        entities/
        interfaces/
      infrastructure/
        repositories/
      presentation/
        controllers/
        swagger/
      users.module.ts

    tasks/
      application/
        use-cases/
        dto/
      domain/
        entities/
        interfaces/
      infrastructure/
        repositories/
      presentation/
        controllers/
        swagger/
      tasks.module.ts

    mfa/
      application/
        use-cases/
        dto/
      domain/
        entities/
        interfaces/
      infrastructure/
        providers/
        repositories/
      presentation/
        controllers/
        swagger/
      mfa.module.ts

  shared/
    application/
    domain/
    infrastructure/
    presentation/

  common/
    decorators/
    filters/
    interceptors/
    guards/
    pipes/
    exceptions/
    constants/

  prisma/
    prisma.module.ts
    prisma.service.ts

  config/
    env/
    swagger/
    auth/
    database/

  app.module.ts
  main.ts

prisma/
  schema.prisma
  migrations/
  seed.ts

test/
  unit/
  integration/
  e2e/

docker/
  postgres/
  backend/

docs/
  architecture.md
  setup.md
  api.md
  tasks-log.md
```

---

## 6. Responsabilidades por Camada

### 6.1 Presentation

Responsável por:

- receber request
- aplicar validações de boundary
- chamar caso de uso
- converter resposta para contrato HTTP
- documentar endpoints no Swagger

Não deve:

- acessar banco diretamente
- conter regra de negócio
- tomar decisões complexas de domínio

### 6.2 Application

Responsável por:

- orquestrar casos de uso
- coordenar fluxos
- aplicar regras de aplicação
- depender de abstrações do domínio e contratos

### 6.3 Domain

Responsável por:

- regras centrais de negócio
- contratos
- invariantes
- entidades de domínio
- value objects, quando fizer sentido

### 6.4 Infrastructure

Responsável por:

- Prisma
- integrações externas
- providers
- adapters
- implementações concretas de interfaces

---

## 7. Convenções de Implementação

### 7.1 Controllers

Controllers devem apenas:

- receber request
- validar entrada
- extrair contexto autenticado
- chamar use case
- retornar response padronizada

Controllers não devem:

- acessar Prisma
- montar queries
- conter regra de autorização complexa
- conter lógica de MFA
- conter lógica de hash ou token

### 7.2 Use Cases

Todo fluxo importante deve ter um use case explícito.

Exemplos:

- `RegisterUserUseCase`
- `LoginUserUseCase`
- `GetAuthenticatedUserUseCase`
- `CreateTaskUseCase`
- `ListTasksUseCase`
- `UpdateTaskUseCase`
- `DeleteTaskUseCase`
- `StartMicrosoftMfaUseCase`
- `VerifyMicrosoftMfaUseCase`

Use cases devem:

- ser pequenos
- ter responsabilidade única
- ser testáveis isoladamente
- depender de interfaces, não de implementações concretas

### 7.3 DTOs

Todo input externo deve ser validado por DTO.

Exemplos mínimos:

- `RegisterDto`
- `LoginDto`
- `CreateTaskDto`
- `UpdateTaskDto`
- `TaskQueryDto`
- `StartMfaDto`
- `VerifyMfaDto`

Obrigatório:

- `class-validator`
- `class-transformer`
- mensagens de erro compreensíveis
- validações coerentes com o domínio

### 7.4 Repositórios

Repositórios devem ser abstraídos por interface no domínio ou application contract.

Regras:

- o domínio não deve conhecer Prisma
- a implementação concreta fica na infraestrutura
- repositórios devem expressar intenção de negócio, não apenas CRUD cru

### 7.5 Prisma

O acesso ao banco deve ser centralizado e disciplinado.

Regras:

- queries legíveis
- evitar duplicação
- não espalhar Prisma por várias camadas
- proteger consistência transacional
- não retornar dados sensíveis desnecessariamente

### 7.6 Swagger

Swagger é obrigatório.

Deve existir documentação viva em:

- `/api/docs`

Todo endpoint deve ter:

- summary
- descrição
- payload documentado
- response codes
- auth quando aplicável
- exemplos quando útil

Swagger deve refletir a API real, não uma intenção futura.

---

## 8. Segurança Obrigatória

O agente deve garantir:

- senha sempre com hash forte
- JWT emitido corretamente
- rotas privadas protegidas
- usuário acessa apenas seus próprios dados quando aplicável
- payload do token enxuto
- nenhum dado sensível exposto
- validação de entrada no boundary
- MFA Microsoft integrado ao fluxo de autenticação definido

### Regras mínimas

- nunca salvar senha em texto puro
- nunca confiar em input do client
- nunca expor password
- nunca expor segredos em log
- sempre filtrar por ownership quando aplicável
- sempre validar autenticação e autorização
- MFA deve ser tratado como requisito de segurança real, não decorativo

---

## 9. MFA Microsoft

O projeto deve prever autenticação multifator com Microsoft.

### Objetivo

Adicionar capacidade de autenticação complementar usando conta Microsoft e fluxo de MFA, conforme estratégia definida para o projeto.

### Requisitos mínimos

- desenhar o fluxo de autenticação Microsoft no backend
- prever integração com provider Microsoft
- suportar fluxo de login federado
- suportar segunda etapa de verificação quando aplicável
- documentar claramente no README e no Swagger o fluxo implementado

### Regras

- segredos do provider devem estar em `.env`
- callbacks devem ser configuráveis
- implementação deve ser desacoplada
- autenticação Microsoft deve ser testada ao menos em nível de serviço/adapters com mocks
- caso o fluxo real dependa de ambiente externo, deve haver estratégia de simulação ou mock para testes automatizados

---

## 10. Banco de Dados

O banco oficial do projeto é PostgreSQL.

### Obrigatório

- PostgreSQL rodando via Docker
- Prisma como ORM
- migrations versionadas
- seed inicial
- documentação de setup
- variáveis de ambiente documentadas

### Regras de modelagem

- ids estáveis
- timestamps obrigatórios nas entidades principais
- unique constraints quando necessário
- enums quando fizer sentido
- integridade referencial obrigatória
- ownership explícito nas entidades do usuário

---

## 11. Docker

Docker é obrigatório.

### Obrigatório no projeto

- Dockerfile para backend
- `docker-compose.yml` com backend + postgres
- healthcheck quando possível
- documentação de uso
- ambiente local reproduzível

### Objetivo

Garantir que qualquer avaliador consiga subir o projeto com o menor atrito possível.

---

## 12. Testes — Regra Obrigatória

O código deve conter testes cobrindo integralmente o comportamento relevante do sistema.

### Regra principal

Todo código entregue deve vir acompanhado de testes.

### Meta obrigatória do projeto

- 100% de cobertura dos use cases
- 100% de cobertura das regras de negócio
- 100% de cobertura dos fluxos críticos de autenticação
- 100% de cobertura dos fluxos críticos de MFA
- 100% de cobertura dos fluxos críticos de CRUD principal

### Camadas de teste obrigatórias

#### Testes unitários

- use cases
- serviços de domínio
- validadores críticos
- helpers de segurança

#### Testes de integração

- controllers + app
- auth
- tasks
- persistência relevante
- guards
- fluxo documentado de MFA com mocks

#### Testes e2e

- registro
- login
- acesso autenticado
- CRUD principal
- fluxo de documentação disponível
- endpoints críticos

### Regras de testes

- não criar código sem teste correspondente
- não avançar task com teste quebrado
- testes devem ser legíveis
- mocks devem ser conscientes
- não maquiar cobertura com testes vazios
- priorizar comportamento, não implementação

---

## 13. Tratamento de Erros

A API deve responder com clareza e previsibilidade.

### Obrigatório

- exceptions adequadas do NestJS
- filtro global de exceções quando necessário
- mensagens coerentes
- payload de erro consistente
- erros previsíveis documentados

### Cenários mínimos tratados

- credenciais inválidas
- token inválido
- token expirado
- acesso negado
- payload inválido
- email já cadastrado
- recurso não encontrado
- conflito de estado
- falha de integração externa
- falha no fluxo de MFA

---

## 14. Definition of Ready (DoR)

Uma task só pode começar quando existir:

- objetivo claro
- caso de uso definido
- critério de aceitação claro
- impacto arquitetural entendido
- impacto em banco entendido, se houver
- estratégia de testes definida
- contrato HTTP definido, se aplicável

Se faltar alguma informação:

- documentar a suposição
- implementar da forma mais simples e reversível possível

---

## 15. Definition of Done (DoD)

Uma task só é considerada concluída quando:

- implementação funcional pronta
- arquitetura respeitada
- use case criado quando necessário
- DTO validando corretamente
- autenticação/autorização aplicadas
- testes da task implementados e passando
- cobertura exigida respeitada
- Swagger atualizado
- README ajustado se houver impacto operacional
- log de progresso atualizado
- lint passando
- build passando
- migrations e seed ajustados, se necessário
- Docker funcionando, se a task impactar ambiente
- agente interrompe execução e aguarda autorização para a próxima task

---

## 16. Protocolo de Execução por Task

Este projeto deve ser executado em tasks pequenas, controladas e auditáveis.

### Regra obrigatória de fluxo

Ao finalizar uma task, o agente deve:

- concluir a implementação da task atual
- executar validações
- atualizar log da task
- registrar o commit sugerido
- resumir o que foi entregue
- parar
- aguardar autorização explícita para iniciar a próxima task

### Regra inegociável

O agente nunca deve emendar automaticamente a próxima task.

Sempre deve perguntar no final:

> Posso seguir para a próxima task?

---

## 17. Log de Progresso de Tasks

Deve existir um arquivo de acompanhamento contínuo, por exemplo:

- `docs/tasks-log.md`

Toda task concluída deve registrar:

- ID da task
- nome da task
- objetivo
- arquivos criados/alterados
- decisões técnicas
- testes adicionados
- endpoints afetados
- migrations afetadas
- status
- data
- commit sugerido

### Exemplo de estrutura de log

```md
## TASK-BE-001 - Setup inicial do backend

- Status: concluída
- Objetivo: estruturar projeto base com NestJS, Prisma, Docker e PostgreSQL
- Arquivos principais: ...
- Decisões: ...
- Testes: ...
- Commit sugerido: chore(backend): bootstrap backend project structure
```

---

## 18. Padrão de Commits

Usar Conventional Commits.

### Template obrigatório

```txt
<type>(backend): <descrição curta no imperativo>
```

### Exemplos

- `feat(backend): create register use case`
- `feat(backend): add microsoft mfa integration flow`
- `fix(backend): prevent access to foreign task`
- `refactor(backend): isolate prisma repository adapter`
- `test(backend): cover auth and tasks use cases`
- `docs(backend): document docker setup and swagger access`
- `chore(backend): configure postgres and docker compose`

### Tipos permitidos

- `feat`
- `fix`
- `refactor`
- `docs`
- `test`
- `chore`
- `perf`
- `style`

---

## 19. Hooks Obrigatórios

### `pre-commit`

Executar:

- `lint-staged`
- formatação automática
- testes relacionados à mudança, quando possível

### `pre-push`

Executar:

- lint
- build
- testes unitários
- testes de integração
- cobertura mínima configurada

Objetivo:
impedir entrada de código quebrado ou sem qualidade.

---

## 20. Quality Gates

Nenhuma alteração pode ser considerada pronta se falhar em qualquer item abaixo:

- lint
- format check
- type-check
- build
- testes unitários
- testes de integração
- testes e2e, quando aplicável
- cobertura mínima exigida
- atualização de Swagger
- atualização do log de tasks
- atualização do README, se necessário

### Gate mínimo obrigatório

```bash
npm run lint
npm run build
npm run test
npm run test:cov
npm run test:e2e
```

Se Prisma for impactado:

```bash
npx prisma generate
npx prisma migrate dev
```

Se Docker for impactado:

```bash
docker compose up --build
```

---

## 21. Documentação Obrigatória

Este projeto deve conter documentação completa.

### Arquivos obrigatórios

- `README.md`
- `docs/architecture.md`
- `docs/setup.md`
- `docs/tasks-log.md`

### `README.md` deve conter no mínimo

- visão geral do projeto
- stack utilizada
- arquitetura adotada
- explicação da Clean Architecture aplicada
- como rodar localmente
- como rodar com Docker
- como configurar `.env`
- como subir PostgreSQL
- como rodar migrations
- como rodar seed
- como rodar testes
- como acessar Swagger
- como funciona autenticação JWT
- como funciona MFA Microsoft
- decisões técnicas
- dependências instaladas e justificativas
- estrutura de pastas
- troubleshooting básico

### Swagger na documentação

O README deve informar explicitamente:

- URL do Swagger
- como acessar `/api/docs`
- necessidade de autenticação nos endpoints protegidos
- como usar bearer token no Swagger

---

## 22. Regras Específicas de Auth

O agente deve garantir:

- registro com validação
- login com comparação segura de senha
- JWT emitido corretamente
- endpoint de usuário autenticado
- guards nas rotas privadas
- refresh strategy, se adotada, claramente documentada
- MFA Microsoft integrado ao fluxo escolhido

Não incluir dados desnecessários no token.

---

## 23. Regras Específicas de CRUD

Ao implementar CRUD, o agente deve garantir:

- create validado
- read com ownership quando aplicável
- update seguro
- delete seguro
- not found tratado
- acesso indevido bloqueado
- testes cobrindo todos os cenários críticos

---

## 24. Regras de Qualidade de Código

O código deve ser:

- legível
- previsível
- modular
- tipado
- rastreável
- fácil de explicar

### Proibições

- `any` sem justificativa
- regra de negócio em controller
- Prisma espalhado em várias camadas
- dependências sem justificativa
- abstrações prematuras
- código morto
- comentários inúteis
- endpoints sem Swagger
- ausência de testes
- ausência de atualização de log por task

---

## 25. Não Fazer

O agente não deve:

- misturar controller, infra e negócio sem critério
- expor dados sensíveis
- confiar em input do client
- criar overengineering desnecessário
- avançar várias tasks sem checkpoint
- pular documentação
- esquecer Docker
- esquecer PostgreSQL
- esquecer Swagger
- esquecer MFA Microsoft
- esquecer testes
- esquecer atualização do log
- seguir para a próxima task sem autorização explícita

---

## 26. Tasks do Projeto

A execução deste backend deve ser dividida nas tasks abaixo.

### TASK-BE-001 — Bootstrap do projeto backend

**Objetivo**

- criar base do projeto NestJS
- configurar TypeScript
- configurar ESLint, Prettier, Husky, lint-staged e commitlint
- preparar estrutura inicial alinhada à Clean Architecture

**Entregáveis**

- projeto inicial funcional
- estrutura de pastas criada
- scripts básicos
- hooks configurados

**Testes**

- validar bootstrap
- validar lint/build

**Commit sugerido**

`chore(backend): bootstrap backend project with clean architecture structure`

### TASK-BE-002 — Docker + PostgreSQL + Prisma

**Objetivo**

- adicionar Dockerfile
- adicionar docker-compose
- subir PostgreSQL
- configurar Prisma
- criar schema inicial
- configurar migrations

**Entregáveis**

- ambiente local reproduzível
- banco conectado
- `prisma generate` funcionando
- migration inicial

**Testes**

- integração básica com banco
- smoke test de inicialização

**Commit sugerido**

`chore(backend): configure docker postgres and prisma`

### TASK-BE-003 — Documentação base

**Objetivo**

- criar `README.md`
- criar `docs/architecture.md`
- criar `docs/setup.md`
- criar `docs/tasks-log.md`

**Entregáveis**

- documentação inicial completa
- instruções de setup local e docker
- explicação da arquitetura

**Testes**

- validação manual de comandos documentados

**Commit sugerido**

`docs(backend): add architecture setup and execution documentation`

### TASK-BE-004 — Módulo de autenticação JWT

**Objetivo**

- implementar registro
- implementar login
- hash de senha
- emissão de JWT
- guard de autenticação
- endpoint do usuário autenticado

**Entregáveis**

- auth funcional
- DTOs
- use cases
- controllers
- testes completos

**Testes**

- unit
- integration
- e2e
- cobertura total dos fluxos críticos

**Commit sugerido**

`feat(backend): implement jwt authentication flow`

### TASK-BE-005 — Swagger

**Objetivo**

- configurar Swagger
- documentar endpoints de auth
- manter `/api/docs` funcional

**Entregáveis**

- swagger configurado
- decorators padronizados
- documentação acessível

**Testes**

- smoke test do endpoint de docs
- validação manual do contrato

**Commit sugerido**

`docs(backend): configure swagger documentation`

### TASK-BE-006 — Entidade principal de negócio

**Objetivo**

- modelar entidade principal do MVP
- criar migration
- criar repositório
- criar use cases de CRUD

**Entregáveis**

- modelagem pronta
- persistência pronta
- camada de domínio e aplicação coerentes

**Testes**

- unit
- integration

**Commit sugerido**

`feat(backend): add main domain entity and repository contracts`

### TASK-BE-007 — CRUD completo

**Objetivo**

- implementar create
- implementar read/list
- implementar update
- implementar delete
- validar ownership

**Entregáveis**

- CRUD completo ponta a ponta
- erros tratados
- DTOs e swagger atualizados

**Testes**

- 100% cobertura dos fluxos críticos
- integração e e2e do CRUD

**Commit sugerido**

`feat(backend): implement full crud for main entity`

### TASK-BE-008 — MFA Microsoft

**Objetivo**

- adicionar autenticação/integração Microsoft
- prever fluxo de MFA
- documentar configuração
- integrar ao fluxo de autenticação definido

**Entregáveis**

- provider configurável
- adapter desacoplado
- endpoints/documentação
- mocks de teste

**Testes**

- unit dos adapters/use cases
- integration do fluxo controlado
- cobertura total dos fluxos críticos implementados

**Commit sugerido**

`feat(backend): add microsoft mfa authentication flow`

### TASK-BE-009 — Seed + dados de avaliação

**Objetivo**

- criar seed mínima
- dados úteis para avaliador
- documentar execução

**Entregáveis**

- seed reproduzível
- script de execução

**Testes**

- validação de execução da seed

**Commit sugerido**

`chore(backend): add database seed for evaluation`

### TASK-BE-010 — Fortalecimento final de qualidade

**Objetivo**

- revisar arquitetura
- revisar cobertura
- revisar logs
- revisar documentação
- revisar swagger
- revisar docker
- revisar scripts

**Entregáveis**

- backend pronto para entrega
- documentação coerente
- cobertura validada
- checklist final validado

**Testes**

- suíte completa
- cobertura
- smoke final

**Commit sugerido**

`chore(backend): finalize backend quality gates and delivery readiness`

---

## 27. Checklist Automático por Task

Antes de encerrar qualquer task, validar:

### Arquitetura

- controller está enxuto
- use case está explícito
- domínio não depende de infra
- responsabilidade está bem separada

### Segurança

- input validado
- dados sensíveis protegidos
- ownership respeitado
- auth correta
- MFA respeitado quando aplicável

### Qualidade

- lint passou
- build passou
- testes passaram
- cobertura passou
- sem `any` sem justificativa
- sem código morto

### Documentação

- Swagger atualizado
- README atualizado se necessário
- docs atualizados se necessário
- tasks-log atualizado

### Processo

- commit sugerido registrado
- resumo da task pronto
- execução interrompida
- autorização solicitada para a próxima task

---

## 28. Resultado Esperado

Ao final, o backend deve ser:

- alinhado a Clean Architecture
- modular
- seguro
- documentado
- com Swagger funcional
- com Docker funcional
- com PostgreSQL funcional
- com MFA Microsoft previsto e implementado
- com README completo
- com log contínuo de tasks
- com cobertura de testes total nos fluxos críticos
- fácil de manter
- fácil de defender tecnicamente
- pronto para evolução incremental
