const admin = require('firebase-admin');
const path = require('path');

// 1. Cargamos la llave primero
const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));

// 2. Inicializamos Firebase DE INMEDIATO (fuera de la función)
// Esto asegura que 'db' no sea nulo cuando las rutas lo necesiten
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

// 3. Ahora sí, exportamos la base de datos ya inicializada
const db = admin.firestore();

const connectDB = () => {
    try {
        // Solo para confirmar en consola que todo está bien
        console.log('✅ Servidor vinculado exitosamente a Firebase (PSICEI-TESJo)');
    } catch (error) {
        console.error('❌ Error crítico de conexión a Firebase:', error.message);
        process.exit(1);
    }
};

module.exports = { db, connectDB };