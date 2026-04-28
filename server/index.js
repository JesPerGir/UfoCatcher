import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Score from './models/Score.js';
import jwt from 'jsonwebtoken';
import User from './models/User.js'

dotenv.config();

// Inicializa la aplicación de Express
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
        // Si falla la base de datos, apaga el servidor
        process.exit(1); 
    }
};

connectDB();

// LOGIN DE USUARIO
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca al usuario por su email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Credenciales inválidas" });
        }

        // Usa la función auxiliar del modelo para comparar contraseñas
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: "Credenciales inválidas" });
        }

        // Crea su token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            mensaje: "¡Bienvenido de vuelta, comandante!",
            usuario: { id: user._id, username: user.username, email: user.email },
            token
        });

    } catch (error) {
        res.status(500).json({ error: "Error en el servidor al iniciar sesión" });
    }
});

// REGISTRO DE USUARIO
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Comprueba si el usuario o el email ya están en la base de datos
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ error: "El piloto o el correo ya están registrados" });
        }

        // Crea el nuevo usuario (Mongoose llamará a bcrypt automáticamente)
        const newUser = new User({ username, email, password });
        await newUser.save();

        // Crea el "id de usuario" (Token)
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            mensaje: "¡Piloto registrado con éxito!",
            usuario: { id: newUser._id, username: newUser.username, email: newUser.email },
            token
        });
    } catch (error) {
        console.error("🔴 Error oculto al registrar:", error);
        res.status(500).json({ error: "Error en el servidor al registrar" });
    }
});

// Middleware para proteger rutas
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

    if (!token) return res.status(401).json({ error: "Acceso denegado. Se requiere token." });

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verificado; // Guarda el ID del usuario para usarlo después
        next();
    } catch (error) {
        res.status(400).json({ error: "Token inválido o caducado." });
    }
};

// --- ENDPOINTS ---

// Endpoint de prueba, se ejecutará al ir a "http://localhost:3000/"
app.get('/', (req, res) => {

    res.send("¡Hola! El servidor de UfoCatcher está funcionando perfectamente.");
});

// Endpoint para las puntuaciones

// OBTENER HISTORIAL
app.get('/api/puntuaciones/historial', verificarToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        const historial = await Score.find({ usuario: user.username })
                                     .sort({ fecha: -1 })
                                     .limit(10);
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener historial" });
    }
});

// GUARDAR PUNTUACIÓN (Ahora es segura)
app.post('/api/puntuaciones', verificarToken, async (req, res) => {
    try {
        const { puntos } = req.body;
        const user = await User.findById(req.user.id);

        const nuevaPuntuacion = new Score({
            usuario: user.username,
            puntos: puntos,
            fecha: new Date()
        });

        await nuevaPuntuacion.save();
        res.status(201).json({ mensaje: "Puntuación guardada con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar la puntuación" });
    }
});

// RANKING GLOBAL (Es público)
app.get('/api/puntuaciones/ranking', async (req, res) => {
    try {
        const ranking = await Score.find().sort({ puntos: -1 }).limit(10);
        res.json(ranking);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener ranking" });
    }
});

// Actualizar una puntuación (Protegido)
app.put('/api/puntuaciones/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params; 
        const { puntos } = req.body; 
        
        // Obtiene el nombre del usuario de forma segura a través de su Token
        const user = await User.findById(req.user.id);
        
        // Actualiza usando el nombre real del usuario logueado
        const puntuacionActualizada = await Score.findByIdAndUpdate(
            id, 
            { usuario: user.username, puntos }, 
            { new: true }
        );
        
        if (!puntuacionActualizada) return res.status(404).json({ error: "Puntuación no encontrada" });
        res.json({ mensaje: "Puntuación actualizada", puntuacion: puntuacionActualizada });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la puntuación" });
    }
});

// Eliminar una puntuación (Protegido)
app.delete('/api/puntuaciones/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const puntuacionBorrada = await Score.findByIdAndDelete(id);
        
        if (!puntuacionBorrada) return res.status(404).json({ error: "Puntuación no encontrada" });
        res.json({ mensaje: "Puntuación borrada con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al borrar la puntuación" });
    }
});


// ACTUALIZAR PERFIL DE USUARIO
app.put('/api/usuarios/perfil', verificarToken, async (req, res) => {
    try {
        // Extraemos los datos que nos envía el frontend
        const { email, currentPassword, newPassword } = req.body;
        
        // Busca al usuario usando el ID de su Token seguro
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "Piloto no encontrado" });

        // Actualizar Email (Si lo ha cambiado)
        if (email && email !== user.email) {
            // Comprueba que el nuevo email no esté ya cogido por otro usuario
            const emailTaken = await User.findOne({ email });
            if (emailTaken) {
                return res.status(400).json({ error: "Este correo ya está registrado en otra nave." });
            }
            user.email = email;
        }

        // Actualizar Contraseña (Si ha escrito algo en el campo "Nueva Contraseña")
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ error: "Debes introducir tu contraseña actual por seguridad." });
            }
            
            // Verifica que la contraseña actual que ha puesto sea correcta
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ error: "La contraseña actual es incorrecta." });
            }
            
            // Si es correcta, le asigna la nueva
            user.password = newPassword; 
        }

        // Guarda los cambios. El modelo "User.js" volverá a encriptar la contraseña automáticamente gracias a bcrypt.
        await user.save();

        res.json({ mensaje: "¡Datos de piloto actualizados con éxito!" });

    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        res.status(500).json({ error: "Error en los servidores centrales." });
    }
});

// --- ARRANCAR EL SERVIDOR ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});