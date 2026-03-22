# Boilerplate Nest API

API REST com NestJS, Prisma e PostgreSQL.

## Pré-requisitos

- Node.js 18+
- Yarn
- PostgreSQL

## Instalação

yarn

## Configuração

# Copie o arquivo de ambiente:

cp .env.dev.example .env.dev

# Edite .env.dev e configure:

DATABASE_URL: URL de conexão PostgreSQL (ex: postgresql://user:pass@localhost:5432/dbname)
Para produção, use .env.prod (baseado em .env.prod.example).

## Banco de dados

# Criar migrations

yarn prisma:migrate:dev

# Aplicar em produção

yarn prisma:deploy

# Interface visual do banco

yarn prisma:studio

## Execução

# Desenvolvimento (watch mode)

yarn dev

# Produção

yarn build
yarn start
