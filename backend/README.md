# Backend - Banho e Tosa

API REST construída com Spring Boot e PostgreSQL para gestão de clientes, pets e agendamentos de banho e tosa.

## Requisitos

- Java 17+
- Maven 3.9+
- PostgreSQL 13+

## Configuração

1. Crie um banco de dados PostgreSQL e ajuste as variáveis de ambiente conforme necessário.
2. Defina as variáveis de ambiente (opcional):

```
export DB_URL=jdbc:postgresql://localhost:5432/pi_banho_e_tosa
export DB_USERNAME=seu_usuario
export DB_PASSWORD=sua_senha
export JWT_SECRET=sua-chave-super-secreta
export JWT_EXPIRATION=PT4H
export PORT=8080
```

3. Execute a aplicação:

```
mvn spring-boot:run
```

Ao iniciar a aplicação um profissional padrão é criado automaticamente com as credenciais `profissional@banhoetosa.com` / `profissional123`.

## Principais endpoints

| Método | Caminho | Descrição |
| ------ | ------ | --------- |
| `POST` | `/api/auth/register` | Cadastro de clientes com retorno do token JWT. |
| `POST` | `/api/auth/login` | Autenticação de clientes e profissionais. |
| `GET` | `/api/usuarios/me` | Dados do usuário autenticado. |
| `GET` | `/api/pets` | Lista pets do cliente autenticado. |
| `POST` | `/api/pets` | Cadastra um novo pet para o cliente autenticado. |
| `GET` | `/api/appointments` | Lista agendamentos do cliente ou do profissional autenticado. |
| `POST` | `/api/appointments` | Cria um novo agendamento. |
| `POST` | `/api/appointments/{id}/cancel` | Cancela um agendamento do cliente. |
| `POST` | `/api/appointments/{id}/reschedule` | Reagenda um atendimento. |
| `POST` | `/api/appointments/{id}/complete` | Marca atendimento como concluído (profissional). |
| `GET` | `/api/appointments/availability` | Consulta horários disponíveis para um serviço em uma data. |

As rotas acima utilizam o prefixo `/api` devido ao `context-path` configurado no `application.yml`.
