const UsuarioRepository = require('../repositories/UsuarioRepository');
const JogoRepository = require('../repositories/JogoRepository');

class JogoService {
    // Gerar tabuleiro 5x5 com diamantes e bombas
    gerarTabuleiro() {
        const tamanho = 5;
        const tabuleiro = [];
        const totalDiamantes = 12; // 12 diamantes e 13 bombas (total 25)

        // Criar matriz vazia
        for (let i = 0; i < tamanho; i++) {
            tabuleiro[i] = [];
            for (let j = 0; j < tamanho; j++) {
                tabuleiro[i][j] = null;
            }
        }

        // Posicionar diamantes aleatoriamente
        let diamantesColocados = 0;
        while (diamantesColocados < totalDiamantes) {
            const linha = Math.floor(Math.random() * tamanho);
            const coluna = Math.floor(Math.random() * tamanho);
            
            if (tabuleiro[linha][coluna] === null) {
                tabuleiro[linha][coluna] = 'DIAMANTE';
                diamantesColocados++;
            }
        }

        // Preencher o resto com bombas
        for (let i = 0; i < tamanho; i++) {
            for (let j = 0; j < tamanho; j++) {
                if (tabuleiro[i][j] === null) {
                    tabuleiro[i][j] = 'BOMBA';
                }
            }
        }

        return tabuleiro;
    }

    // Iniciar jogo
    async startGame(usuarioId, valorAposta) {
        // Validar valor da aposta
        if (valorAposta <= 0) {
            throw new Error('O valor da aposta deve ser maior que zero');
        }

        // Buscar usuário
        const usuario = await UsuarioRepository.findById(usuarioId);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        // Validar saldo
        if (usuario.saldo < valorAposta) {
            throw new Error('Saldo insuficiente para realizar a aposta');
        }

        // Verificar se já existe jogo em andamento
        const jogoEmAndamento = await JogoRepository.findActiveGameByUser(usuarioId);
        if (jogoEmAndamento) {
            throw new Error('Usuário já possui uma partida em andamento. Finalize-a antes de iniciar uma nova.');
        }

        // Debita o valor da aposta
        const novoSaldo = usuario.saldo - valorAposta;
        await UsuarioRepository.updateSaldo(usuarioId, novoSaldo);

        // Gerar tabuleiro
        const tabuleiro = this.gerarTabuleiro();

        // Criar o jogo
        const jogo = await JogoRepository.create(usuarioId, valorAposta, tabuleiro);

        return { gameId: jogo.id };
    }

    // Revelar posição
    async revealPosition(jogoId, linha, coluna) {
        // Validar coordenadas
        if (linha < 0 || linha > 4 || coluna < 0 || coluna > 4) {
            throw new Error('Posição inválida. Linha e coluna devem estar entre 0 e 4');
        }

        // Buscar jogo
        const jogo = await JogoRepository.findById(jogoId);
        if (!jogo) {
            throw new Error('Jogo não encontrado');
        }

        if (jogo.status !== 'EM_ANDAMENTO') {
            throw new Error('Este jogo já foi finalizado');
        }

        // Verificar se posição já foi revelada
        const jaRevelada = await JogoRepository.isPositionRevealed(jogoId, linha, coluna);
        if (jaRevelada) {
            throw new Error('Posição já revelada. Escolha outra posição.');
        }

        const tabuleiro = jogo.tabuleiro;
        const tipo = tabuleiro[linha][coluna];

        // Registrar posição revelada
        await JogoRepository.saveRevealedPosition(jogoId, linha, coluna, tipo);

        if (tipo === 'BOMBA') {
            // PERDEU O JOGO
            await JogoRepository.updateGame(jogoId, 'DERROTA', 0, jogo.diamantesEncontrados);
            return {
                resultado: 'BOMBA',
                status: 'PERDIDO'
            };
        } else if (tipo === 'DIAMANTE') {
            // Encontrou diamante
            const novosDiamantes = jogo.diamantesEncontrados + 1;
            const premio = jogo.valorAposta * (1 + (novosDiamantes * 0.33));
            const premioFormatado = parseFloat(premio.toFixed(2));

            await JogoRepository.updateGame(jogoId, 'EM_ANDAMENTO', premioFormatado, novosDiamantes);

            return {
                resultado: 'DIAMANTE',
                diamantesEncontrados: novosDiamantes,
                premioAtual: premioFormatado
            };
        }
    }

    // Cashout - sacar prêmio
    async cashout(jogoId) {
        const jogo = await JogoRepository.findById(jogoId);
        if (!jogo) {
            throw new Error('Jogo não encontrado');
        }

        if (jogo.status !== 'EM_ANDAMENTO') {
            throw new Error('Este jogo já foi finalizado');
        }

        const premio = jogo.premioAtual;
        const usuarioId = jogo.usuarioId;

        // Buscar usuário
        const usuario = await UsuarioRepository.findById(usuarioId);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        // Creditar prêmio ao saldo do usuário
        const novoSaldo = usuario.saldo + premio;
        await UsuarioRepository.updateSaldo(usuarioId, novoSaldo);

        // Finalizar jogo com vitória
        await JogoRepository.updateGame(jogoId, 'VITORIA', premio, jogo.diamantesEncontrados);

        return {
            message: `Prêmio de R$ ${premio.toFixed(2)} creditado com sucesso!`,
            novoSaldo: novoSaldo
        };
    }
}

module.exports = new JogoService();
