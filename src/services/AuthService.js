const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioRepository = require('../repositories/UsuarioRepository');

class AuthService {
    // Validar requisitos da senha
    validatePassword(senha) {
        const temMinimo8 = senha.length >= 8;
        const temMaiuscula = /[A-Z]/.test(senha);
        const temNumero = /[0-9]/.test(senha);
        const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

        if (!temMinimo8) {
            return { valido: false, mensagem: 'A senha deve ter no mínimo 8 caracteres' };
        }
        if (!temMaiuscula) {
            return { valido: false, mensagem: 'A senha deve conter pelo menos uma letra maiúscula' };
        }
        if (!temNumero) {
            return { valido: false, mensagem: 'A senha deve conter pelo menos um número' };
        }
        if (!temEspecial) {
            return { valido: false, mensagem: 'A senha deve conter pelo menos um caractere especial' };
        }

        return { valido: true };
    }

    // Cadastrar usuário
    async register(nome, email, dataNascimento, senha, confirmacaoSenha) {
        // Validar se senhas coincidem
        if (senha !== confirmacaoSenha) {
            throw new Error('As senhas não coincidem');
        }

        // Validar requisitos da senha
        const validacao = this.validatePassword(senha);
        if (!validacao.valido) {
            throw new Error(validacao.mensagem);
        }

        // Verificar se email já existe
        const usuarioExistente = await UsuarioRepository.findByEmail(email);
        if (usuarioExistente) {
            throw new Error('E-mail já cadastrado');
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // Criar usuário
        const usuario = await UsuarioRepository.create(
            nome,
            email,
            dataNascimento,
            senhaHash
        );

        return usuario;
    }

    // Login
    async login(email, senha) {
        const usuario = await UsuarioRepository.findByEmail(email);
        if (!usuario) {
            throw new Error('E-mail ou senha inválidos');
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
        if (!senhaValida) {
            throw new Error('E-mail ou senha inválidos');
        }

        return usuario;
    }

    // Resetar senha
    async resetPassword(id, novaSenha) {
        // Buscar usuário
        const usuario = await UsuarioRepository.findById(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        // Validar requisitos da nova senha
        const validacao = this.validatePassword(novaSenha);
        if (!validacao.valido) {
            throw new Error(validacao.mensagem);
        }

        // Verificar se a nova senha é igual à atual
        const senhaIgual = await bcrypt.compare(novaSenha, usuario.senhaHash);
        if (senhaIgual) {
            throw new Error('A nova senha não pode ser igual à senha atual');
        }

        // Hash da nova senha
        const salt = await bcrypt.genSalt(10);
        const novaSenhaHash = await bcrypt.hash(novaSenha, salt);

        // Atualizar senha
        const usuarioAtualizado = await UsuarioRepository.updatePassword(id, novaSenhaHash);
        return usuarioAtualizado;
    }
}

module.exports = new AuthService();
