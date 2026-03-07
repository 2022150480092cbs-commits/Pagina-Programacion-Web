// /SIGEST/backend/middleware/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    // 1. Obtener el token del encabezado (Header)
    // El formato esperado es: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    // Extraer solo el token (quitando "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // 2. Verificar la validez del token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 3. Adjuntar la información del usuario a la solicitud
        // La información (id, role) viene del payload que creaste en el login
        req.user = decoded;

        // Continuar con la ejecución de la ruta
        next();
    } catch (ex) {
        // Error si el token es inválido o ha expirado
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

module.exports = authMiddleware;