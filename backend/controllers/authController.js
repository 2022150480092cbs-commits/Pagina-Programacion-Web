// backend/controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Importa tu Clase Modelo User
// Puedes crear un archivo de servicios para JWT, pero por ahora lo dejamos aquí.
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_segura'; // ¡Usa tu .env!

/**
 * Lógica para la autenticación (Login).
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar usuario por email usando el método del modelo
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // 2. Comparar contraseña con el hash guardado (password_hash)
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // 3. Generar JWT
        const payload = { id: user.id, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

        // 4. Enviar respuesta
        res.json({
            token,
            user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
            message: 'Login exitoso'
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Lógica para el registro de nuevos usuarios.
 */
exports.register = async (req, res) => {
    // Campos enviados desde tu RegisterPage.jsx (ya mapeados)
    const { name, email, username, password, phone, area } = req.body;

    // Validar datos básicos
    if (!name || !email || !username || !password || !area) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    try {
        // 1. Verificar si ya existe por email o username (Usando tus nuevos métodos)
        const emailExists = await User.findByEmail(email);
        if (emailExists) {
            return res.status(409).json({ message: 'El correo institucional ya está registrado.' });
        }
        const usernameExists = await User.findByUsername(username);
        if (usernameExists) {
            return res.status(409).json({ message: 'El nombre de usuario ya está tomado.' });
        }

        // 2. Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Crear nuevo usuario en la DB usando el método del modelo
        const newUser = await User.create({
            email: email,
            username: username,
            password_hash: hashedPassword,
            full_name: name,
            phone: phone || null, // Permite que el teléfono sea NULL si no se envió
            area_code: area,
            role: 'viewer' // Rol por defecto
        });

        // 4. Generar Token
        const payload = { id: newUser.id, role: newUser.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

        // 5. Respuesta
        res.status(201).json({
            token,
            message: 'Usuario registrado exitosamente.',
            user: { id: newUser.id, email: newUser.email, role: newUser.role }
        });

    } catch (error) {
        console.error('Error durante el registro:', error);
        res.status(500).json({ message: 'Error interno del servidor al registrar.' });
    }
};