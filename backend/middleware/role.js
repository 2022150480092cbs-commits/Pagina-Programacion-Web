// /SIGEST/backend/middleware/role.js

// Función que devuelve un middleware (Closure)
const checkRole = (roles) => (req, res, next) => {
    // El req.user fue establecido previamente por authMiddleware
    if (!req.user || !req.user.role) {
        return res.status(404).json({ message: 'Usuario no autenticado.' });
    }

    // 1. Verificar si el rol del usuario está en la lista de roles permitidos
    if (roles.includes(req.user.role)) {
        // El rol es correcto, continuar
        next();
    } else {
        // 2. El rol no tiene permiso
        res.status(403).json({ message: 'Acceso prohibido. No tienes los permisos necesarios.' });
    }
};

module.exports = checkRole;