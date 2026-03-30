# API

## Base URL

Ambiente local:

- `http://localhost:3000`

Todos os endpoints usam o prefixo global:

- `/api`

## Swagger

Documentacao interativa disponivel em:

- `http://localhost:3000/api/docs`

Documento OpenAPI em JSON:

- `http://localhost:3000/api/docs-json`

## Endpoints disponiveis

### `GET /api/health`

Funcao:

- verificar se a API esta ativa
- confirmar que o backend subiu corretamente

Resposta esperada:

```json
{
  "status": "ok",
  "service": "directads-backend",
  "timestamp": "2026-03-30T00:00:00.000Z"
}
```

### `POST /api/auth/register`

Funcao:

- registrar um novo usuario
- retornar JWT e dados publicos do usuario

Payload:

```json
{
  "name": "Leona",
  "email": "leona@example.com",
  "password": "secret123"
}
```

### `POST /api/auth/login`

Funcao:

- autenticar um usuario por email e senha
- retornar JWT diretamente quando o MFA ainda nao estiver habilitado
- retornar `mfaRequired=true` e `mfaToken` temporario quando o MFA TOTP estiver habilitado

Payload:

```json
{
  "email": "leona@example.com",
  "password": "secret123"
}
```

Resposta sem MFA habilitado:

```json
{
  "mfaRequired": false,
  "accessToken": "jwt-final",
  "user": {
    "id": "user-1",
    "name": "Leona",
    "email": "leona@example.com",
    "mfaEnabled": false,
    "createdAt": "2026-03-30T00:00:00.000Z",
    "updatedAt": "2026-03-30T00:00:00.000Z"
  }
}
```

Resposta com MFA habilitado:

```json
{
  "mfaRequired": true,
  "mfaToken": "jwt-temporario-para-segunda-etapa",
  "user": {
    "id": "user-1",
    "name": "Leona",
    "email": "leona@example.com",
    "mfaEnabled": true,
    "createdAt": "2026-03-30T00:00:00.000Z",
    "updatedAt": "2026-03-30T00:00:00.000Z"
  }
}
```

### `GET /api/auth/me`

Funcao:

- retornar os dados do usuario autenticado

Requer:

- `Authorization: Bearer <token>`

### `POST /api/mfa/setup`

Funcao:

- gerar um secret TOTP para o usuario autenticado
- devolver `otpauthUrl` e `qrCodeDataUrl`
- permitir escanear o QR code em apps compativeis como Microsoft Authenticator

Requer:

- `Authorization: Bearer <token>`

Resposta esperada:

```json
{
  "secret": "BASE32SECRET",
  "otpauthUrl": "otpauth://totp/DirectAds:leona%40example.com?secret=BASE32SECRET&issuer=DirectAds&period=30",
  "qrCodeDataUrl": "data:image/png;base64,..."
}
```

### `POST /api/mfa/enable`

Funcao:

- confirmar o primeiro codigo TOTP
- ativar o MFA no usuario

Requer:

- `Authorization: Bearer <token>`

Payload:

```json
{
  "code": "123456"
}
```

### `POST /api/mfa/verify-login`

Funcao:

- concluir o login quando `POST /api/auth/login` responder com `mfaRequired=true`
- validar o `mfaToken` temporario e o codigo TOTP atual
- emitir o JWT final da API

Payload:

```json
{
  "mfaToken": "jwt-temporario-para-segunda-etapa",
  "code": "123456"
}
```

## CRUD de tasks

Todos os endpoints de `tasks` exigem autenticacao JWT.

### `POST /api/tasks`

Payload:

```json
{
  "title": "Preparar demonstracao tecnica",
  "description": "Organizar roteiro e validacoes",
  "status": "TODO"
}
```

### `GET /api/tasks`

Exemplos:

```txt
http://localhost:3000/api/tasks
http://localhost:3000/api/tasks?status=IN_PROGRESS
```

### `GET /api/tasks/:taskId`

Busca uma task especifica do usuario autenticado.

### `PATCH /api/tasks/:taskId`

Payload de exemplo:

```json
{
  "status": "DONE",
  "description": null
}
```

### `DELETE /api/tasks/:taskId`

Remove uma task do usuario autenticado.

## Regras do fluxo MFA por TOTP

- o setup do MFA e feito depois do cadastro ou depois de um login normal ja autenticado
- o endpoint `POST /api/mfa/setup` sempre gera um novo `secret` e invalida qualquer configuracao anterior ainda nao confirmada
- o endpoint `POST /api/mfa/enable` ativa o MFA somente apos validar um codigo TOTP valido
- quando `mfaEnabled=true`, o login deixa de entregar o JWT final na primeira etapa
- a segunda etapa deve ser concluida em `POST /api/mfa/verify-login`
- o TOTP e compativel com Microsoft Authenticator, Google Authenticator e apps equivalentes

## Regras de ownership

- um usuario so enxerga as proprias tasks
- acesso a task de outro usuario retorna `404`
- criacao, atualizacao e remocao operam sempre no contexto do usuario autenticado

## Dados de avaliacao sugeridos

Apos `yarn db:seed`, o ambiente local fica com:

- `leona@example.com / secret123`
- `mario@example.com / secret123`
- `carla@example.com / secret123`

## Status codes relevantes

- `200 OK`
- `201 Created`
- `401 Unauthorized`
- `404 Not Found`
- `409 Conflict`

## Estado final da API

- healthcheck funcional
- auth JWT funcional
- MFA por TOTP com QR code funcional
- CRUD principal funcional
- Swagger funcional e alinhado ao contrato real
