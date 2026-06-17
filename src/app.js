require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/games', gameRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.json({
        message: 'API Campo Minado está rodando!',
        endpoints: {
            auth: {
                register: 'POST /auth/register',
                login: 'POST /auth/login',
                resetPassword: 'PATCH /auth/reset-password'
            },
            users: {
                getById: 'GET /users/{id}',
                dashboard: 'GET /users/{id}/dashboard',
                updateSaldo: 'PUT /users/{id}',
                delete: 'DELETE /users/{id}'
            },
            games: {
                start: 'POST /games/start',
                reveal: 'POST /games/{gameId}/reveal',
                cashout: 'POST /games/{gameId}/cashout'
            }
        }
    });
});

// Tratamento de erro 404
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento de erro genérico
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📝 Acesse: http://localhost:${PORT}`);
});

module.exports = app;
