CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'status_agendamento'
  ) THEN
    CREATE TYPE status_agendamento AS ENUM ('pendente', 'confirmado', 'cancelado', 'concluido', 'ausente');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS roles (
  id_role UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (nome)
SELECT 'cliente'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nome = 'cliente');

INSERT INTO roles (nome)
SELECT 'profissional'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nome = 'profissional');

CREATE TABLE IF NOT EXISTS clientes (
  id_cliente UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(150) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  data_cadastro TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  id_role UUID REFERENCES roles(id_role)
);

CREATE TABLE IF NOT EXISTS profissionais (
  id_profissional UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(150) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(150) UNIQUE,
  senha_hash TEXT,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  id_role UUID REFERENCES roles(id_role)
);

UPDATE clientes
SET id_role = (SELECT id_role FROM roles WHERE nome = 'cliente')
WHERE id_role IS NULL;

UPDATE profissionais
SET id_role = (SELECT id_role FROM roles WHERE nome = 'profissional')
WHERE id_role IS NULL;

ALTER TABLE clientes
  ALTER COLUMN id_role SET NOT NULL;

ALTER TABLE profissionais
  ALTER COLUMN id_role SET NOT NULL;

CREATE TABLE IF NOT EXISTS animais (
  id_animal UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_cliente UUID NOT NULL REFERENCES clientes(id_cliente) ON DELETE CASCADE,
  nome VARCHAR(120) NOT NULL,
  especie VARCHAR(80) NOT NULL,
  porte VARCHAR(50),
  idade INTEGER,
  observacoes TEXT
);

CREATE TABLE IF NOT EXISTS servicos (
  id_servico UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_servico VARCHAR(150) NOT NULL,
  descricao TEXT,
  valor NUMERIC(10,2),
  tempo_estimado INTEGER NOT NULL DEFAULT 60
);

CREATE TABLE IF NOT EXISTS agendamentos (
  id_agendamento UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_cliente UUID NOT NULL REFERENCES clientes(id_cliente) ON DELETE CASCADE,
  id_animal UUID NOT NULL REFERENCES animais(id_animal) ON DELETE CASCADE,
  id_servico UUID NOT NULL REFERENCES servicos(id_servico),
  id_profissional UUID NOT NULL REFERENCES profissionais(id_profissional),
  data_horario TIMESTAMPTZ NOT NULL,
  status status_agendamento NOT NULL DEFAULT 'pendente',
  observacoes TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS historico_atendimentos (
  id_historico UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_agendamento UUID NOT NULL REFERENCES agendamentos(id_agendamento) ON DELETE CASCADE UNIQUE,
  id_profissional UUID NOT NULL REFERENCES profissionais(id_profissional),
  data_conclusao TIMESTAMPTZ NOT NULL,
  observacoes TEXT
);

CREATE TABLE IF NOT EXISTS cancelamentos (
  id_cancelamento UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_agendamento UUID NOT NULL REFERENCES agendamentos(id_agendamento) ON DELETE CASCADE,
  motivo TEXT NOT NULL,
  data_cancelamento TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tokens_recuperacao (
  id_token UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_cliente UUID NOT NULL REFERENCES clientes(id_cliente) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expiracao TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS disponibilidades_profissionais (
  id_disponibilidade UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_profissional UUID NOT NULL REFERENCES profissionais(id_profissional) ON DELETE CASCADE,
  dia_semana SMALLINT NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  UNIQUE (id_profissional, dia_semana, hora_inicio)
);

CREATE TABLE IF NOT EXISTS indisponibilidades_profissionais (
  id_indisponibilidade UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_profissional UUID NOT NULL REFERENCES profissionais(id_profissional) ON DELETE CASCADE,
  data_inicio TIMESTAMPTZ NOT NULL,
  data_fim TIMESTAMPTZ NOT NULL,
  motivo TEXT
);

CREATE INDEX IF NOT EXISTS idx_agendamentos_profissional_data ON agendamentos (id_profissional, data_horario);
CREATE INDEX IF NOT EXISTS idx_agendamentos_cliente ON agendamentos (id_cliente);
CREATE INDEX IF NOT EXISTS idx_cancelamentos_agendamento ON cancelamentos (id_agendamento);
