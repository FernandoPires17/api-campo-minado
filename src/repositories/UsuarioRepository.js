const pool = require('../config/database');
const Usuario = require('../models/Usuario');

class UsuarioRepository {
    async findByEmail(email) {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        return result.rows[0] ? new Usuario(result.rows[0]) : null;
    }

    async findById(id) {
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        return result.rows[0] ? new Usuario(result.rows[0]) : null;
    }

    async create(nome, email, dataNascimento, senhaHash) {
        const result = await pool.query(
            `INSERT INTO usuarios (nome, email, data_nascimento, senha_hash) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [nome, email, dataNascimento, senhaHash]
        );
        return new Usuario(result.rows[0]);
    }

    async updatePassword(id, novaSenhaHash) {
        const result = await pool.query(
            `UPDATE usuarios SET senha_hash = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2 RETURNING *`,
            [novaSenhaHash, id]
        );
        return result.rows[0] ? new Usuario(result.rows[0]) : null;
    }

    async updateSaldo(id, novoSaldo) {
        const result = await pool.query(
            `UPDATE usuarios SET saldo = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2 RETURNING *`,
            [novoSaldo, id]
        );
        return result.rows[0] ? new Usuario(result.rows[0]) : null;
    }

    async getDashboard(id) {
        const result = await pool.query(
            `SELECT 
                COUNT(*) as total_jogos,
                COUNT(CASE WHEN status = 'VITORIA' THEN 1 END) as vitorias,
                COUNT(CASE WHEN status = 'DERROTA' THEN 1 END) as derrotas,
                COALESCE(SUM(CASE WHEN status = 'VITORIA' THEN premio_atual ELSE 0 END), 0) as valor_ganho,
                COALESCE(SUM(CASE WHEN status = 'DERROTA' THEN valor_aposta ELSE 0 END), 0) as valor_perdido
             FROM jogos WHERE usuario_id = $1`,
            [id]
        );
        return result.rows[0];
    }

    async delete(id) {
        const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
        return result.rows[0] ? new Usuario(result.rows[0]) : null;
    }
}

module.exports = new UsuarioRepository();
