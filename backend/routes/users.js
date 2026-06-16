const express = require('express');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/role');
const User = require('../models/User'); // 👈 Importamos tu modelo real de Sequelize

const router = express.Router();

// ==========================================
// 🔓 RUTA PÚBLICA DE DIAGNÓSTICO (Para comprobar conexión en Render)
// ==========================================
router.get('/public-test', async (req, res) => {
    try {
        // Busca un usuario en la tabla de PostgreSQL para verificar conexión
        const users = await User.findAll({ attributes: ['id', 'username', 'email'] });
        res.json({
            status: "success",
            message: "Conexión exitosa a PostgreSQL desde Render (PSICEI)",
            database_records: users
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "El servidor responde, pero falló la consulta a PostgreSQL",
            error: err.message
        });
    }
});

// ==========================================
// 🔒 RUTAS PROTEGIDAS CON MIDDLEWARES
// ==========================================

// Esta ruta requiere: 1. Un token JWT válido y 2. Rol de 'admin'
router.get('/list',
    authMiddleware,
    checkRole(['admin']),
    async (req, res) => {
        res.json({
            message: 'Lista de usuarios obtenida exitosamente.',
            data: [{ id: 1, email: 'admin@sigest.com' }],
            requester: req.user
        });
    });

// Esta ruta requiere un token válido, y es accesible para 'manager', 'admin' y 'basic'
router.get('/profile',
    authMiddleware,
    checkRole(['admin', 'manager', 'basic']),
    (req, res) => {
        res.json({ message: 'Datos de perfil', user: req.user });
    });

module.exports = router;