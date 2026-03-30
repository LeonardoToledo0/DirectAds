# Setup

## Pré-requisitos

- Node.js 22 ou compatível
- Yarn 1.x
- Docker Desktop
- Docker Compose

## 1. Instalar dependências

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

Conteúdo esperado inicialmente:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/directads?schema=public"
```

## 3. Subir apenas o banco com Docker

```bash
docker compose up -d postgres
```

Verificar status:

```bash
docker compose ps
```

## 4. Gerar o Prisma Client

```bash
yarn db:generate
```

## 5. Aplicar a migration inicial

```bash
yarn db:migrate:dev
```

## 6. Executar a seed

```bash
yarn db:seed
```

## 7. Rodar a aplicação localmente

```bash
yarn start:dev
```

API esperada:

- `http://localhost:3000`

Healthcheck:

- `http://localhost:3000/api/health`

## 8. Rodar tudo com Docker

```bash
docker compose up --build
```

Serviços expostos:

- backend em `http://localhost:3000`
- postgres em `localhost:5432`

## 9. Rodar validações

```bash
yarn lint
yarn type-check
yarn build
yarn test
yarn test:integration
yarn test:cov
yarn test:e2e
```

## Comandos úteis

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

### Docker Desktop desligado

Sintoma:

- falha ao subir `docker compose`

Ação:

- iniciar o Docker Desktop
- repetir o comando

### Banco sem migration aplicada

Sintoma:

- Prisma conecta, mas as tabelas ainda não existem

Ação:

```bash
yarn db:migrate:dev
```

### Prisma Client inconsistente

Sintoma:

- erros de importação ou tipos do Prisma

Ação:

```bash
yarn db:generate
```