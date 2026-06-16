const express = require("express");
const router = express.Router();
// Importamos la conexión REAL de Firebase desde la carpeta config
const { db } = require("../config/db");

// Ruta para obtener usuarios desde Firestore
router.get("/users", async (req, res) => {
    try {
        const snapshot = await db.collection("users").get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Error en Firestore: " + err.message });
    }
});

// Ruta para registrar usuarios desde el formulario del TESJo
router.post("/register", async (req, res) => {
    try {
        const userData = req.body;
        const docRef = await db.collection("users").add({
            ...userData,
            createdAt: new Date()
        });
        res.status(201).json({ message: "Usuario guardado en Firebase", id: docRef.id });
    } catch (err) {
        res.status(500).json({ error: "Error al guardar: " + err.message });
    }
});

// Exportamos el enrutador una sola vez al final del archivo
module.exports = router;