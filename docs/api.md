# API

## Base URL

Ambiente local:

- `http://localhost:3000`

Todos os endpoints atuais usam o prefixo global:

- `/api`

## Swagger

Documentação interativa disponível em:

- `http://localhost:3000/api/docs`

Documento OpenAPI em JSON:

- `http://localhost:3000/api/docs-json`

No Swagger, os endpoints protegidos de `auth` e `tasks` usam bearer token.

## Endpoints disponíveis

### `GET /api/health`

Função:

- verificar se a API está ativa
- confirmar o bootstrap básico do backend

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

### `POST /api/auth/register`

Função:

- registrar um novo usuário
- retornar token JWT e dados públicos do usuário

Payload:

```json
{
  "name": "Leona",
  "email": "leona@example.com",
  "password": "secret123"
}
```

### `POST /api/auth/login`

Função:

- autenticar um usuário existente
- retornar token JWT e dados públicos do usuário

Payload:

```json
{
  "email": "leona@example.com",
  "password": "secret123"
}
```

### `GET /api/auth/me`

Função:

- retornar os dados do usuário autenticado

Requer:

- header `Authorization: Bearer <token>`

## CRUD de tasks

Todos os endpoints de `tasks` exigem autenticação JWT.

### `POST /api/tasks`

Função:

- criar uma nova task para o usuário autenticado

Payload:

```json
{
  "title": "Preparar demonstracao tecnica",
  "description": "Organizar roteiro e validacoes",
  "status": "TODO"
}
```

### `GET /api/tasks`

Função:

- listar as tasks do usuário autenticado
- filtrar opcionalmente por status

Exemplos:

```txt
http://localhost:3000/api/tasks
http://localhost:3000/api/tasks?status=IN_PROGRESS
```

### `GET /api/tasks/:taskId`

Função:

- buscar uma task específica do usuário autenticado

### `PATCH /api/tasks/:taskId`

Função:

- atualizar parcialmente uma task do usuário autenticado

Payload de exemplo:

```json
{
  "status": "DONE",
  "description": null
}
```

### `DELETE /api/tasks/:taskId`

Função:

- remover uma task do usuário autenticado

## Regras de ownership

- um usuário só enxerga as próprias tasks
- acesso a task de outro usuário retorna `404`
- criação, atualização e remoção operam sempre no contexto do usuário autenticado

## Status codes relevantes

- `200 OK`
- `201 Created`
- `401 Unauthorized`
- `404 Not Found`
- `409 Conflict`

## Autenticação

A autenticação JWT já está implementada.

Payload atual do token:

- `sub`
- `email`

## Roadmap da API

Próximos blocos previstos:

- MFA Microsoft
- seed final de avaliação
- revisão final de entrega
