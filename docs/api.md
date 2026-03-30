# API

## Base URL

Ambiente local:

- `http://localhost:3000`

Todos os endpoints atuais usam o prefixo global:

- `/api`

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

### Status code

- `200 OK`

## Autenticação

No estado atual, nenhum endpoint exige autenticação.

## Swagger

Ainda não configurado.

Quando for implementado, a documentação interativa deverá ficar em:

- `/api/docs`

## Roadmap da API

Próximos blocos previstos:

- autenticação JWT
- endpoint do usuário autenticado
- CRUD do domínio principal
- documentação Swagger
- MFA Microsoft