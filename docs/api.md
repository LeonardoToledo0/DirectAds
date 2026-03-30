# API

## Base URL

Ambiente local:

- http://localhost:3000

Todos os endpoints usam o prefixo global:

- /api

## Swagger

Documentação interativa disponível em:

- http://localhost:3000/api/docs

Documento OpenAPI em JSON:

- http://localhost:3000/api/docs-json

## Endpoints disponíveis

### GET /api/health

Função:

- verificar se a API está ativa
- confirmar que o backend subiu corretamente

Resposta esperada:

`json
{
  "status": "ok",
  "service": "directads-backend",
  "timestamp": "2026-03-30T00:00:00.000Z"
}
`

### POST /api/auth/register

Função:

- registrar um novo usuário
- retornar JWT e dados públicos do usuário

Payload:

`json
{
  "name": "Leona",
  "email": "leona@example.com",
  "password": "secret123"
}
`

### POST /api/auth/login

Função:

- autenticar um usuário por email e senha
- retornar JWT diretamente quando o MFA ainda não estiver habilitado
- retornar mfaRequired=true e mfaToken temporário quando o MFA TOTP estiver habilitado

Payload:

`json
{
  "email": "leona@example.com",
  "password": "secret123"
}
`

Resposta sem MFA habilitado:

`json
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
`

Resposta com MFA habilitado:

`json
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
`

### GET /api/auth/me

Função:

- retornar os dados do usuário autenticado

Requer:

- Authorization: Bearer <token>

### POST /api/mfa/setup

Função:

- gerar um secret TOTP para o usuário autenticado
- devolver otpauthUrl e qrCodeDataUrl
- permitir escanear o QR code em apps compatíveis como Microsoft Authenticator

Requer:

- Authorization: Bearer <token>

Resposta esperada:

`json
{
  "secret": "BASE32SECRET",
  "otpauthUrl": "otpauth://totp/DirectAds:leona%40example.com?secret=BASE32SECRET&issuer=DirectAds&period=30",
  "qrCodeDataUrl": "data:image/png;base64,..."
}
`

### POST /api/mfa/enable

Função:

- confirmar o primeiro código TOTP
- ativar o MFA no usuário

Requer:

- Authorization: Bearer <token>

Payload:

`json
{
  "code": "123456"
}
`

### POST /api/mfa/verify-login

Função:

- concluir o login quando POST /api/auth/login responder com mfaRequired=true
- validar o mfaToken temporário e o código TOTP atual
- emitir o JWT final da API

Payload:

`json
{
  "mfaToken": "jwt-temporario-para-segunda-etapa",
  "code": "123456"
}
`

## CRUD de tasks

Todos os endpoints de 	asks exigem autenticação JWT.

### POST /api/tasks

Payload:

`json
{
  "title": "Preparar demonstracao tecnica",
  "description": "Organizar roteiro e validacoes",
  "status": "TODO"
}
`

### GET /api/tasks

Exemplos:

`	xt
http://localhost:3000/api/tasks
http://localhost:3000/api/tasks?status=IN_PROGRESS
`

### GET /api/tasks/:taskId

Busca uma task específica do usuário autenticado.

### PATCH /api/tasks/:taskId

Payload de exemplo:

`json
{
  "status": "DONE",
  "description": null
}
`

### DELETE /api/tasks/:taskId

Remove uma task do usuário autenticado.

## Regras do fluxo MFA por TOTP

- o setup do MFA é feito depois do cadastro ou depois de um login normal já autenticado
- o endpoint POST /api/mfa/setup sempre gera um novo secret e invalida qualquer configuração anterior ainda não confirmada
- o endpoint POST /api/mfa/enable ativa o MFA somente após validar um código TOTP válido
- quando mfaEnabled=true, o login deixa de entregar o JWT final na primeira etapa
- a segunda etapa deve ser concluída em POST /api/mfa/verify-login
- o TOTP é compatível com Microsoft Authenticator, Google Authenticator e apps equivalentes

## Regras de ownership

- um usuário só enxerga as próprias tasks
- acesso a task de outro usuário retorna 404
- criação, atualização e remoção operam sempre no contexto do usuário autenticado

## Dados de avaliação sugeridos

Após yarn db:seed, o ambiente local fica com:

- leona@example.com / secret123
- mario@example.com / secret123
- carla@example.com / secret123

## Status codes relevantes

- 200 OK
- 201 Created
- 401 Unauthorized
- 404 Not Found
- 409 Conflict

## Estado final da API

- healthcheck funcional
- auth JWT funcional
- MFA por TOTP com QR code funcional
- CRUD principal funcional
- Swagger funcional e alinhado ao contrato real
