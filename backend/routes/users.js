// /SIGEST/backend/routes/users.js

const express = require('express');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/role');

const router = express.Router();

// Esta ruta requiere: 
// 1. Un token JWT válido (authMiddleware)
// 2. Que el usuario tenga el rol de 'admin' (checkRole(['admin']))
router.get('/list',
    authMiddleware,
    checkRole(['admin']),
    async (req, res) => {
        // Lógica para obtener la lista de todos los usuarios desde la DB
        // La información del usuario que hizo la petición está en req.user
        res.json({
            message: 'Lista de usuarios obtenida exitosamente.',
            data: [{ id: 1, email: 'admin@sigest.com' }],
            // Puedes ver el usuario que hizo la petición:
            requester: req.user
        });
    });

// Esta ruta requiere un token válido, y es accesible para 'manager' y 'admin'
router.get('/profile',
    authMiddleware,
    checkRole(['admin', 'manager', 'basic']),
    (req, res) => {
        // Lógica para devolver el perfil del usuario logueado (usando req.user.id)
        res.json({ message: 'Datos de perfil', user: req.user });
    });

module.exports = router;