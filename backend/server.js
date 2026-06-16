const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Cargar variables de entorno (.env)

// --- 1. Importar Conexión y Rutas ---
const { connectDB } = require('./config/db'); // Conexión a PostgreSQL
require('./models/User'); // Sincronización del modelo User con la BD

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users'); // Rutas protegidas de usuarios

const app = express();
// OBLIGATORIO PARA RENDER: process.env.PORT en mayúsculas primero
const PORT = process.env.PORT || 3000;

// ------------------------------------
// --- 2. Middlewares ---
// ------------------------------------
// Modificado para que acepte peticiones de tu React local (localhost:3000 o 5173) y de Render
app.use(cors({
    origin: [
        'https://pagina-programacion-web.onrender.com',
        'http://localhost:3000',
        'http://localhost:5173'
    ],
    credentials: true
}));

app.use(bodyParser.json());
app.use(express.json());

// ------------------------------------
// --- 3. Conexión a DB ---
// ------------------------------------
connectDB(); // Inicializa PostgreSQL/Sequelize

// ------------------------------------
// --- 4. Definición de Rutas (Endpoints) ---
// ------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Ruta de prueba en la raíz (evita el "Cannot GET /")
app.get('/', (req, res) => {
    res.send('🚀 API de SIGEST funcionando correctamente con Express y PostgreSQL.');
});

// ------------------------------------
// --- 5. Iniciar Servidor ---
// ------------------------------------
// Escuchamos en '0.0.0.0' para que Render pueda rutear el tráfico correctamente en Linux
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor Express escuchando en el puerto ${PORT}`);
});