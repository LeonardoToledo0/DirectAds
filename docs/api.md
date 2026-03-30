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

No Swagger, o endpoint protegido `GET /api/auth/me` usa bearer token.

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

### Status codes relevantes

- `200 OK`
- `201 Created`
- `401 Unauthorized`
- `409 Conflict`

## Autenticação

A autenticação JWT já está implementada.

Payload atual do token:

- `sub`
- `email`

## Roadmap da API

Próximos blocos previstos:

- CRUD do domínio principal
- MFA Microsoft