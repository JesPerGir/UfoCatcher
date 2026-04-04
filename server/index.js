import express from 'express';
import cors from 'cors';

// Inicializamos la aplicación de Express
const app = express();
const PORT = 3000;

// Configuración básica
app.use(cors()); // Permite que React se conecte
app.use(express.json()); // Prepara al servidor para que entienda datos en formato JSON

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