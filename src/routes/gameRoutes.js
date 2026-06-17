const express = require('express');
const JogoController = require('../controllers/JogoController');

const router = express.Router();

// Rotas de jogo
router.post('/start', JogoController.start);
router.post('/:gameId/reveal', JogoController.reveal);
router.post('/:gameId/cashout', JogoController.cashout);

module.exports = router;
