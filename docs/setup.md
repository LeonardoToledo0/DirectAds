# Setup

## Pré-requisitos

- Node.js 22 ou compatível
- Yarn 1.x
- Docker Desktop
- Docker Compose

## 1. Instalar dependências

`ash
yarn install
`

## 2. Criar o arquivo .env

Windows:

`ash
copy .env.example .env
`

Unix:

`ash
cp .env.example .env
`

Conteúdo base:

`env
PORT=3000
JWT_SECRET="directads-dev-secret"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/directads?schema=public"
TOTP_APP_NAME="DirectAds"
`

## 3. Subir apenas o banco com Docker

`ash
docker compose up -d postgres
`

## 4. Gerar o Prisma Client

`ash
yarn db:generate
`

## 5. Aplicar as migrations

Desenvolvimento:

`ash
yarn db:migrate:dev
`

Ambiente não interativo:

`ash
yarn db:migrate:deploy
`

## 6. Executar a seed

`ash
yarn db:seed
`

Dados de avaliação criados pela seed:

- usuário Leona Silva com email leona@example.com e senha secret123
- usuário Mario Souza com email mario@example.com e senha secret123
- usuário Carla Mendes com email carla@example.com e senha secret123
- tasks distribuídas entre os três usuários com status TODO, IN_PROGRESS e DONE

## 7. Rodar a aplicação localmente

`ash
yarn start:dev
`

URLs úteis:

- API em http://localhost:3000
- healthcheck em http://localhost:3000/api/health
- Swagger em http://localhost:3000/api/docs

## 8. Rodar tudo com Docker

`ash
docker compose up --build
`

O backend em container executa yarn db:migrate:deploy antes de iniciar a API.

## 9. Configurar MFA por TOTP

Fluxo esperado:

1. registre ou faça login com email e senha
2. chame POST /api/mfa/setup autenticado com JWT
3. escaneie o qrCodeDataUrl no Microsoft Authenticator ou app equivalente
4. gere um código de 6 dígitos no app
5. chame POST /api/mfa/enable com esse código
6. nos próximos logins, use POST /api/auth/login e depois POST /api/mfa/verify-login

## 10. Rodar validações

`ash
yarn lint
yarn type-check
yarn build
yarn test
yarn test:integration
yarn test:cov
yarn test:e2e
yarn quality:check
`

## Comandos úteis

Parar containers:

`ash
docker compose down
`

Parar containers e remover volumes:

`ash
docker compose down -v
`

Rebuild completo:

`ash
docker compose up --build
`

## Problemas comuns

### Banco sem migration aplicada

Sintoma:

- Prisma conecta, mas as tabelas ainda não existem

Ação:

`ash
yarn db:migrate:dev
`

Ou, em ambiente não interativo:

`ash
yarn db:migrate:deploy
`

### Prisma Client inconsistente

Sintoma:

- erros de importação ou tipos do Prisma

Ação:

`ash
yarn db:generate
`

### Login passou a exigir token MFA

Sintoma:

- POST /api/auth/login responde com mfaRequired=true

Ação:

- use o mfaToken retornado no body
- abra o Microsoft Authenticator
- envie o código atual em POST /api/mfa/verify-login

### QR code não foi lido

Sintoma:

- o app autenticador não reconhece o QR code

Ação:

- verifique se TOTP_APP_NAME está preenchido
- gere o setup novamente em POST /api/mfa/setup
- use o otpauthUrl como alternativa para importação manual
