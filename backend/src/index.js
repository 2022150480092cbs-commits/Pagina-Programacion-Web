const express = require("express");
const cors = require("cors");
// 1. IMPORTAMOS y EJECUTAMOS la conexión primero que nada
const { connectDB } = require("../config/db");
connectDB();

// 2. IMPORTAMOS las rutas después de inicializar Firebase
const routes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", routes);

// El puerto debe leer process.env.PORT obligatoriamente en producción
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});