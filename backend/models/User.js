// Importa el pool de conexión
const { pool } = require('../config/db');

class User {
    /**
     * Busca un usuario por su correo electrónico
     */
    static async findByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    /**
     * Busca un usuario por su nombre de usuario
     */
    static async findByUsername(username) {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0];
    }

    /**
     * Crea un nuevo usuario en la base de datos
     * 
     * @param {Object} data - Datos del usuario
     * @param {string} data.email - Correo electrónico
     * @param {string} data.username - Nombre de usuario
     * @param {string} data.password_hash - Contraseña cifrada (bcrypt)
     * @param {string} data.role - Rol del usuario (admin, viewer, etc.)
     * @param {string} data.full_name - Nombre completo
     * @param {string} data.phone - Número de teléfono
     * @param {string} data.area_code - Código o nombre del área
     */
    static async create({ email, username, password_hash, role = 'viewer', full_name, phone, area_code }) {
        const query = `
            INSERT INTO users (email, username, password_hash, role, full_name, phone, area_code)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [email, username, password_hash, role, full_name, phone, area_code];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    /**
     * Obtiene un usuario por su ID
     */
    static async findById(id) {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    /**
     * Actualiza los datos de un usuario
     */
    static async update(id, { email, username, role, full_name, phone, area_code }) {
        const query = `
            UPDATE users
            SET email = $1,
                username = $2,
                role = $3,
                full_name = $4,
                phone = $5,
                area_code = $6
            WHERE id = $7
            RETURNING *;
        `;
        const values = [email, username, role, full_name, phone, area_code, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    /**
     * Elimina un usuario por su ID
     */
    static async delete(id) {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        return { message: 'Usuario eliminado correctamente' };
    }
}

module.exports = User;
