class Jogo {
    constructor({ id, usuario_id, valor_aposta, premio_atual, diamantes_encontrados, status, tabuleiro }) {
        this.id = id;
        this.usuarioId = usuario_id;
        this.valorAposta = parseFloat(valor_aposta);
        this.premioAtual = parseFloat(premio_atual) || 0;
        this.diamantesEncontrados = diamantes_encontrados || 0;
        this.status = status || 'EM_ANDAMENTO';
        this.tabuleiro = tabuleiro;
    }

    toJSON() {
        return {
            id: this.id,
            valorAposta: this.valorAposta,
            premioAtual: this.premioAtual,
            diamantesEncontrados: this.diamantesEncontrados,
            status: this.status,
            tabuleiro: this.tabuleiro
        };
    }
}

module.exports = Jogo;
