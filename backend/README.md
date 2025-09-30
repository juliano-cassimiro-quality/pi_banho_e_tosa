# Backend - Sistema de Banho e Tosa

## Scripts

- `npm install` — instala dependências.
- `npm run dev` — inicia servidor com nodemon.
- `npm start` — inicia servidor em produção.
- `npm run lint` — executa ESLint.

## Estrutura

```
src/
  config/        # Conexão com banco de dados
  controllers/   # Camada de controle das rotas
  services/      # Regras de negócio
  routes/        # Definição das rotas
  middlewares/   # Middlewares globais
  utils/         # Utilitários (hash, notificações, disponibilidade)
  db/schema.sql  # Script inicial de banco de dados
```

## Variáveis de ambiente

Crie um arquivo `.env` baseado em `.env.example` com:

```
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/pi_banho_e_tosa
JWT_SECRET=sua-chave
JWT_EXPIRES_IN=1d
```

## Banco de dados

Execute o script `src/db/schema.sql` no PostgreSQL para criar as tabelas necessárias.
