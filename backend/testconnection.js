// initDatabase.js
import dotenv from 'dotenv'
import pkg from 'pg'

dotenv.config()
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Supabase exige SSL
})

const schema = `
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS animais (
    id_animal SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    porte VARCHAR(20) NOT NULL,
    idade INT NOT NULL,
    observacoes TEXT,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS profissionais (
    id_profissional SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    senha_hash VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS servicos (
    id_servico SERIAL PRIMARY KEY,
    nome_servico VARCHAR(50) NOT NULL,
    descricao TEXT,
    valor DECIMAL(10,2) NOT NULL,
    tempo_estimado INT NOT NULL
);

CREATE TABLE IF NOT EXISTS agendamentos (
    id_agendamento SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_animal INT NOT NULL,
    id_servico INT NOT NULL,
    id_profissional INT NOT NULL,
    data_horario TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente',
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_animal) REFERENCES animais(id_animal),
    FOREIGN KEY (id_servico) REFERENCES servicos(id_servico),
    FOREIGN KEY (id_profissional) REFERENCES profissionais(id_profissional)
);

CREATE TABLE IF NOT EXISTS historico_atendimentos (
    id_historico SERIAL PRIMARY KEY,
    id_agendamento INT NOT NULL,
    id_profissional INT NOT NULL,
    data_conclusao TIMESTAMP NOT NULL,
    observacoes TEXT,
    FOREIGN KEY (id_agendamento) REFERENCES agendamentos(id_agendamento),
    FOREIGN KEY (id_profissional) REFERENCES profissionais(id_profissional)
);

CREATE TABLE IF NOT EXISTS cancelamentos (
    id_cancelamento SERIAL PRIMARY KEY,
    id_agendamento INT NOT NULL,
    motivo VARCHAR(255),
    data_cancelamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_agendamento) REFERENCES agendamentos(id_agendamento)
);
`

async function init() {
  try {
    await pool.query(schema)
    console.log("✅ Banco de dados criado com sucesso!")
  } catch (err) {
    console.error("❌ Erro ao criar banco:", err)
  } finally {
    await pool.end()
  }
}

init()
