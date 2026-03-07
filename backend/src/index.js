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

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor PSICEI-TESJo en puerto ${PORT}`));