const JogoService = require('../services/JogoService');

class JogoController {
    async start(req, res) {
        try {
            const { idUser, valorAposta } = req.body;

            if (!idUser || !valorAposta) {
                return res.status(400).json({ error: 'idUser e valorAposta são obrigatórios' });
            }

            const resultado = await JogoService.startGame(idUser, valorAposta);
            return res.status(201).json(resultado);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async reveal(req, res) {
        try {
            const { gameId } = req.params;
            const { linha, coluna } = req.body;

            if (!gameId) {
                return res.status(400).json({ error: 'gameId é obrigatório' });
            }

            if (linha === undefined || coluna === undefined) {
                return res.status(400).json({ error: 'linha e coluna são obrigatórios' });
            }

            const resultado = await JogoService.revealPosition(parseInt(gameId), linha, coluna);
            return res.json(resultado);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async cashout(req, res) {
        try {
            const { gameId } = req.params;

            if (!gameId) {
                return res.status(400).json({ error: 'gameId é obrigatório' });
            }

            const resultado = await JogoService.cashout(parseInt(gameId));
            return res.json(resultado);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new JogoController();
