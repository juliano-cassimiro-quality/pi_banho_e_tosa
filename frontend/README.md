# Frontend - Sistema de Banho e Tosa

## Scripts

- `npm install` — instala dependências.
- `npm start` — executa o projeto em modo desenvolvimento (porta 3000).
- `npm run build` — gera build de produção.

## Configuração

Crie um arquivo `.env` na raiz do frontend com a variável `REACT_APP_API_URL` apontando para a API Express (por padrão `http://localhost:4000/api`).

## Estrutura

```
src/
  components/   # Componentes reutilizáveis (botões, cards, layout)
  contexts/     # Contexto de autenticação
  hooks/        # Hooks customizados
  pages/        # Páginas principais (login, pets, agendamentos, dashboard)
  routes/       # Rotas protegidas e públicas
  services/     # Configuração do Axios
```

O projeto utiliza TailwindCSS para estilização e responsividade.
