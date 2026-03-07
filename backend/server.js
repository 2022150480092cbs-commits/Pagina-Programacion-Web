// /SIGEST/backend/server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Cargar variables de entorno

// --- 1. Importar Conexión y Rutas ---
const { connectDB } = require('./config/db'); // 👈 Importación de POSTGRESQL/Sequelize
require('./models/User'); // Importar el modelo para que Sequelize lo sincronice

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users'); // 👈 Ruta protegida de usuarios

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------------------------
// --- 2. Middlewares ---
// ------------------------------------
// Permite solicitudes CORS desde el frontend de React (ajusta el puerto si es necesario)
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());
app.use(express.json());

// ------------------------------------
// --- 3. Conexión a DB ---
// ------------------------------------
connectDB(); // Llama a la función que conecta y sincroniza los modelos con PostgreSQL

// ------------------------------------
// --- 4. Definición de Rutas (Endpoints) ---
// ------------------------------------
// Ruta para el login y autenticación
app.use('/api/auth', authRoutes);

// Ruta para recursos protegidos (usará el middleware JWT)
app.use('/api/users', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('🚀 API de SIGEST funcionando correctamente con Express y PostgreSQL.');
});

// ------------------------------------
// --- 5. Iniciar Servidor ---
// ------------------------------------
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
});