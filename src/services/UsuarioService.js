const UsuarioRepository = require('../repositories/UsuarioRepository');

class UsuarioService {
    // Buscar usuário por ID
    async getById(id) {
        const usuario = await UsuarioRepository.findById(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
        return usuario;
    }

    // Buscar dashboard
    async getDashboard(id) {
        const usuario = await UsuarioRepository.findById(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        const estatisticas = await UsuarioRepository.getDashboard(id);
        
        return {
            totalJogos: parseInt(estatisticas.total_jogos) || 0,
            vitorias: parseInt(estatisticas.vitorias) || 0,
            derrotas: parseInt(estatisticas.derrotas) || 0,
            valorGanho: parseFloat(estatisticas.valor_ganho) || 0,
            valorPerdido: parseFloat(estatisticas.valor_perdido) || 0
        };
    }

    // Atualizar saldo
    async updateSaldo(id, saldo) {
        // Validar saldo negativo
        if (saldo < 0) {
            throw new Error('Não é permitido cadastrar saldo negativo');
        }

        // Validar duas casas decimais
        const saldoFormatado = parseFloat(saldo.toFixed(2));
        if (saldoFormatado !== saldo) {
            throw new Error('O saldo deve ter no máximo duas casas decimais');
        }

        const usuario = await UsuarioRepository.findById(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        const usuarioAtualizado = await UsuarioRepository.updateSaldo(id, saldoFormatado);
        return usuarioAtualizado;
    }

    // Deletar usuário
    async delete(id) {
        const usuario = await UsuarioRepository.findById(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        const usuarioDeletado = await UsuarioRepository.delete(id);
        return usuarioDeletado;
    }
}

module.exports = new UsuarioService();
