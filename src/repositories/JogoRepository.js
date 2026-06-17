const pool = require('../config/database');
const Jogo = require('../models/Jogo');

class JogoRepository {
    async findById(id) {
        const result = await pool.query('SELECT * FROM jogos WHERE id = $1', [id]);
        return result.rows[0] ? new Jogo(result.rows[0]) : null;
    }

    async findActiveGameByUser(usuarioId) {
        const result = await pool.query(
            `SELECT * FROM jogos 
             WHERE usuario_id = $1 AND status = 'EM_ANDAMENTO' 
             ORDER BY created_at DESC LIMIT 1`,
            [usuarioId]
        );
        return result.rows[0] ? new Jogo(result.rows[0]) : null;
    }

    async create(usuarioId, valorAposta, tabuleiro) {
        const result = await pool.query(
            `INSERT INTO jogos (usuario_id, valor_aposta, tabuleiro) 
             VALUES ($1, $2, $3) RETURNING *`,
            [usuarioId, valorAposta, JSON.stringify(tabuleiro)]
        );
        return new Jogo(result.rows[0]);
    }

    async updateGame(jogoId, status, premioAtual, diamantesEncontrados) {
        const result = await pool.query(
            `UPDATE jogos 
             SET status = $1, premio_atual = $2, diamantes_encontrados = $3, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $4 RETURNING *`,
            [status, premioAtual, diamantesEncontrados, jogoId]
        );
        return result.rows[0] ? new Jogo(result.rows[0]) : null;
    }

    async saveRevealedPosition(jogoId, linha, coluna, tipo) {
        await pool.query(
            `INSERT INTO posicoes_reveladas (jogo_id, linha, coluna, tipo) 
             VALUES ($1, $2, $3, $4)`,
            [jogoId, linha, coluna, tipo]
        );
    }

    async isPositionRevealed(jogoId, linha, coluna) {
        const result = await pool.query(
            `SELECT * FROM posicoes_reveladas 
             WHERE jogo_id = $1 AND linha = $2 AND coluna = $3`,
            [jogoId, linha, coluna]
        );
        return result.rows.length > 0;
    }

    async getRevealedPositions(jogoId) {
        const result = await pool.query(
            `SELECT linha, coluna, tipo FROM posicoes_reveladas WHERE jogo_id = $1`,
            [jogoId]
        );
        return result.rows;
    }
}

module.exports = new JogoRepository();
