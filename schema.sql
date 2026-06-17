-- Joao aqui eu fiz a criação da tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    saldo DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- aqui fiz a criação da tabela de jogos
CREATE TABLE IF NOT EXISTS jogos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    valor_aposta DECIMAL(10,2) NOT NULL,
    premio_atual DECIMAL(10,2) DEFAULT 0.00,
    diamantes_encontrados INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'EM_ANDAMENTO',
    tabuleiro JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- E aqui foi a criação da tabela de posições reveladas
CREATE TABLE IF NOT EXISTS posicoes_reveladas (
    id SERIAL PRIMARY KEY,
    jogo_id INTEGER NOT NULL,
    linha INTEGER NOT NULL,
    coluna INTEGER NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    revelado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jogo_id) REFERENCES jogos(id) ON DELETE CASCADE,
    UNIQUE(jogo_id, linha, coluna)
);
