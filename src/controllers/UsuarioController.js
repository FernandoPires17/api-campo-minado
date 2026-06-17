const UsuarioService = require('../services/UsuarioService');

class UsuarioController {
    async getById(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: 'ID do usuário é obrigatório' });
            }

            const usuario = await UsuarioService.getById(parseInt(id));
            return res.json(usuario.toJSON());
        } catch (error) {
            return res.status(404).json({ error: error.message });
        }
    }

    async getDashboard(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: 'ID do usuário é obrigatório' });
            }

            const estatisticas = await UsuarioService.getDashboard(parseInt(id));
            return res.json(estatisticas);
        } catch (error) {
            return res.status(404).json({ error: error.message });
        }
    }

    async updateSaldo(req, res) {
        try {
            const { id } = req.params;
            const { saldo } = req.body;

            if (!id) {
                return res.status(400).json({ error: 'ID do usuário é obrigatório' });
            }

            if (saldo === undefined || saldo === null) {
                return res.status(400).json({ error: 'O saldo é obrigatório' });
            }

            const usuario = await UsuarioService.updateSaldo(parseInt(id), parseFloat(saldo));
            return res.json(usuario.toJSON());
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: 'ID do usuário é obrigatório' });
            }

            const usuario = await UsuarioService.delete(parseInt(id));
            return res.json({
                message: 'Usuário excluído com sucesso',
                usuario: usuario.toJSON()
            });
        } catch (error) {
            return res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new UsuarioController();
