// /SIGEST/backend/routes/auth.js

const express = require('express');
const authController = require('../controllers/authController'); // <-- IMPORTAR EL CONTROLADOR
const router = express.Router();

// Nota: Ya no necesitas importar jwt, bcrypt, o User aquí.

// Ruta de Login: apunta a la función login del controlador
router.post('/login', authController.login);

// Ruta de Registro: apunta a la nueva función register del controlador
router.post('/register', authController.register);

module.exports = router;