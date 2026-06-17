class Usuario {
    constructor({ id, nome, email, data_nascimento, senha_hash, saldo }) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.dataNascimento = data_nascimento;
        this.senhaHash = senha_hash;
        this.saldo = parseFloat(saldo) || 0;
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            dataNascimento: this.dataNascimento,
            saldo: this.saldo
        };
    }
}

module.exports = Usuario;
