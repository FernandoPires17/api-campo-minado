const AuthService = require('../services/AuthService');

class AuthController {
    async register(req, res) {
        try {
            const { nome, email, dataNascimento, senha, confirmacaoSenha } = req.body;

            // Validar campos obrigatórios
            if (!nome || !email || !dataNascimento || !senha || !confirmacaoSenha) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            const usuario = await AuthService.register(
                nome,
                email,
                dataNascimento,
                senha,
                confirmacaoSenha
            );

            return res.status(201).json(usuario.toJSON());
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
            }

            const usuario = await AuthService.login(email, senha);

            return res.json({
                nome: usuario.nome,
                email: usuario.email,
                dataNascimento: usuario.dataNascimento
            });
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }

    async resetPassword(req, res) {
        try {
            const { id, novaSenha } = req.body;

            if (!id || !novaSenha) {
                return res.status(400).json({ error: 'ID e nova senha são obrigatórios' });
            }

            const usuario = await AuthService.resetPassword(id, novaSenha);

            return res.json({
                message: 'Senha atualizada com sucesso',
                usuario: usuario.toJSON()
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();
