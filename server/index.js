import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Inicializamos la aplicación de Express
const app = express();
const PORT = 3000;

// Configuración básica
app.use(cors()); // Permite que React se conecte
app.use(express.json()); // Prepara al servidor para que entienda datos en formato JSON

// --- CONEXIÓN A LA BASE DE DATOS ---
const connectDB = async () => {
    try {
        // Se pasa la ruta de .env
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🟢 ¡Conectado a la base de datos MongoDB Atlas!");
    } catch (error) {
        console.error("🔴 Error al conectar a MongoDB:", error);
        // Si falla la base de datos, apagamos el servidor
        process.exit(1); 
    }
};

// Llamamos a la función
connectDB();

// --- ENDPOINTS ---

// Endpoint de prueba, se ejecutará al ir a "http://localhost:3000/"
app.get('/', (req, res) => {

    res.send("¡Hola! El servidor de UfoCatcher está funcionando perfectamente.");
});

// Endpoint para las puntuaciones
app.get('/api/puntuaciones', (req, res) => {
    // Datos placeholder
    const rankingFalso = [
        { usuario: "Jesús", puntos: 1500 },
        { usuario: "Jugador2", puntos: 1200 }
    ];
    res.json(rankingFalso);
});

// --- ARRANCAR EL SERVIDOR ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});