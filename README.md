# API Campo Minado

API REST TRABALHO FINAL BACKEND2 desenvolvida em Node.js para uma plataforma de apostas baseada no jogo Campo Minado.

## Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL
- dotenv
- cors
- bcryptjs
- jsonwebtoken

## Integrantes

- Fernando Pires

## Instalação

```bash
git clone https://github.com/FernandoPires17/api-campo-minado.git
cd api-campo-minado
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campo_minado
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=seu_segredo_super_secreto
```

## Executando a aplicação

```bash
npm run dev
```

A API estará disponível em: `http://localhost:3000`

## Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Cadastrar novo usuário |
| POST | `/auth/login` | Login do usuário |
| PATCH | `/auth/reset-password` | Resetar senha |

### Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users/{id}` | Buscar dados do usuário |
| GET | `/users/{id}/dashboard` | Estatísticas do usuário |
| PUT | `/users/{id}` | Atualizar saldo |
| DELETE | `/users/{id}` | Deletar usuário |

### Jogos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/games/start` | Iniciar nova partida |
| POST | `/games/{gameId}/reveal` | Revelar posição do tabuleiro |
| POST | `/games/{gameId}/cashout` | Sacar prêmio acumulado |
