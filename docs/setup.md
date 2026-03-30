# Setup

## Pre-requisitos

- Node.js 22 ou compativel
- Yarn 1.x
- Docker Desktop
- Docker Compose

## 1. Instalar dependencias

```bash
yarn install
```

## 2. Criar o arquivo `.env`

Windows:

```bash
copy .env.example .env
```

Unix:

```bash
cp .env.example .env
```

Conteudo base:

```env
PORT=3000
JWT_SECRET="directads-dev-secret"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/directads?schema=public"
TOTP_APP_NAME="DirectAds"
```

## 3. Subir apenas o banco com Docker

```bash
docker compose up -d postgres
```

## 4. Gerar o Prisma Client

```bash
yarn db:generate
```

## 5. Aplicar as migrations

Desenvolvimento:

```bash
yarn db:migrate:dev
```

Ambiente nao interativo:

```bash
yarn db:migrate:deploy
```

## 6. Executar a seed

```bash
yarn db:seed
```

Dados de avaliacao criados pela seed:

- usuario `Leona Silva` com email `leona@example.com` e senha `secret123`
- usuario `Mario Souza` com email `mario@example.com` e senha `secret123`
- usuario `Carla Mendes` com email `carla@example.com` e senha `secret123`
- tasks distribuidas entre os tres usuarios com status `TODO`, `IN_PROGRESS` e `DONE`

## 7. Rodar a aplicacao localmente

```bash
yarn start:dev
```

URLs uteis:

- API em `http://localhost:3000`
- healthcheck em `http://localhost:3000/api/health`
- Swagger em `http://localhost:3000/api/docs`

## 8. Rodar tudo com Docker

```bash
docker compose up --build
```

O backend em container executa `yarn db:migrate:deploy` antes de iniciar a API.

## 9. Configurar MFA por TOTP

Fluxo esperado:

1. registre ou faca login com email e senha
2. chame `POST /api/mfa/setup` autenticado com JWT
3. escaneie o `qrCodeDataUrl` no Microsoft Authenticator ou app equivalente
4. gere um codigo de 6 digitos no app
5. chame `POST /api/mfa/enable` com esse codigo
6. nos proximos logins, use `POST /api/auth/login` e depois `POST /api/mfa/verify-login`

## 10. Rodar validacoes

```bash
yarn lint
yarn type-check
yarn build
yarn test
yarn test:integration
yarn test:cov
yarn test:e2e
yarn quality:check
```

## Comandos uteis

Parar containers:

```bash
docker compose down
```

Parar containers e remover volumes:

```bash
docker compose down -v
```

Rebuild completo:

```bash
docker compose up --build
```

## Problemas comuns

### Banco sem migration aplicada

Sintoma:

- Prisma conecta, mas as tabelas ainda nao existem

Acao:

```bash
yarn db:migrate:dev
```

Ou, em ambiente nao interativo:

```bash
yarn db:migrate:deploy
```

### Prisma Client inconsistente

Sintoma:

- erros de importacao ou tipos do Prisma

Acao:

```bash
yarn db:generate
```

### Login passou a exigir token MFA

Sintoma:

- `POST /api/auth/login` responde com `mfaRequired=true`

Acao:

- use o `mfaToken` retornado no body
- abra o Microsoft Authenticator
- envie o codigo atual em `POST /api/mfa/verify-login`

### QR code nao foi lido

Sintoma:

- o app autenticador nao reconhece o QR code

Acao:

- verifique se `TOTP_APP_NAME` esta preenchido
- gere o setup novamente em `POST /api/mfa/setup`
- use o `otpauthUrl` como alternativa para importacao manual
