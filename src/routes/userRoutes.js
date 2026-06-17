const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');

const router = express.Router();

// Rotas de usuário
router.get('/:id', UsuarioController.getById);
router.get('/:id/dashboard', UsuarioController.getDashboard);
router.put('/:id', UsuarioController.updateSaldo);
router.delete('/:id', UsuarioController.delete);

module.exports = router;
