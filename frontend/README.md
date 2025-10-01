# Frontend - Sistema de Banho e Tosa

## Stack

- [Angular 17](https://angular.dev/) com componentes standalone
- Arquitetura em camadas (domain → application → infrastructure → presentation)
- HttpClient com interceptador para autenticação JWT
- Reactive Forms e Signals para controle de estado

## Scripts

- `npm install` — instala dependências.
- `npm start` — executa o projeto em modo desenvolvimento (porta 4200).
- `npm run build` — gera build de produção em `dist/`.
- `npm test` — executa testes unitários com Karma.

## Configuração

Configure a URL da API em `src/environments/environment.ts`. Por padrão apontamos para `http://localhost:8080/api`.

## Estrutura

```
src/
  app/
    core/            # Modelos de domínio, contratos e casos de uso
    infrastructure/  # Implementações HTTP e serviços de armazenamento
    presentation/    # Componentes de UI, páginas e rotas
  environments/      # Configurações por ambiente
  main.ts            # Bootstrap da aplicação
```

Os repositórios concretos são registrados no bootstrap, mantendo a camada de aplicação desacoplada de detalhes de infraestrutura.
