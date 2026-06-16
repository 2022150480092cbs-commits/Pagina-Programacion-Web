const admin = require('firebase-admin');

// 1. Validamos que las variables esenciales existan en Render
if (!process.env.FIREBASE_PROJECT_ID) {
    console.error('❌ Error fatal: Falta configurar las variables de entorno en Render.');
    process.exit(1);
}

// 2. Inicializamos Firebase DE INMEDIATO usando las variables individuales de tu pantalla
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
        // Si tu backend usa el SDK tradicional, agregamos el mapeo de credenciales implícitas
        credential: admin.credential.applicationDefault()
    });
}

// 3. Exportamos la base de datos ya inicializada de forma nativa
const db = admin.firestore();

const connectDB = () => {
    try {
        console.log('✅ Servidor vinculado exitosamente a Firebase (PSICEI-TESJo)');
    } catch (error) {
        console.error('❌ Error crítico de conexión a Firebase:', error.message);
        process.exit(1);
    }
};

module.exports = { db, connectDB };