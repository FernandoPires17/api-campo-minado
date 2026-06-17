const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

// Rotas de autenticação
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.patch('/reset-password', AuthController.resetPassword);

module.exports = router;
