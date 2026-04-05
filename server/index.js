import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Score from './models/Score.js';

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

// 1. Obtener el Ranking
app.get('/api/puntuaciones', async (req, res) => {
    try {
        // Busca todas las puntuaciones en MongoDB, las ordena de mayor a menor
        // y coge solo el Top 10
        const ranking = await Score.find().sort({ puntos: -1 }).limit(10);
        res.json(ranking);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las puntuaciones" });
    }
});

// 2. Guardar una puntuación nueva
app.post('/api/puntuaciones', async (req, res) => {
    try {
        // Extrae el usuario y los puntos que envíe el frontend
        const { usuario, puntos } = req.body;

        // Crea un nuevo documento en la base de datos
        const nuevaPuntuacion = new Score({ usuario, puntos });
        await nuevaPuntuacion.save();

        res.status(201).json({ mensaje: "Puntuación guardada con éxito", puntuacion: nuevaPuntuacion });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar la puntuación" });
    }
});

// --- ARRANCAR EL SERVIDOR ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});