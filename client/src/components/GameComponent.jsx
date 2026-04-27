import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import config from '../game/config';
import EventBus from '../game/EventBus';
import { useAuth } from '../context/AuthContext'; // IMPORTA EL CONTEXTO

const GameComponent = () => {
    const gameRef = useRef(null);
    const [gameStatus, setGameStatus] = useState('Cargando señales espaciales...'); 
    const { token } = useAuth(); // EXTRAEMOS EL TOKEN DEL USUARIO LOGUEADO

    // Inicializar el juego (Solo se ejecuta UNA VEZ)
    useEffect(() => {
        const phaserGame = new Phaser.Game({
            ...config,
            parent: gameRef.current
        });

        return () => {
            phaserGame.destroy(true); 
        };
    }, []); // Array vacío: no depende de nada, no se reinicia

    // Escuchar eventos de Phaser (Depende del token)
    useEffect(() => {
        // Función para actualizar el cartel
        const handleGameStarted = (data) => {
            setGameStatus(data.message); 
        };

        // Función para guardar los puntos al morir
        const handleGameOver = async (puntuacionFinal) => {
            // Si el jugador no ha iniciado sesión, no hacemos nada en la base de datos
            if (!token) {
                console.log("Jugador invitado: No se guardan los puntos.");
                return;
            }

            try {
                // Hace la llamada al backend que creamos antes
                const response = await fetch('http://localhost:3000/api/puntuaciones', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ puntos: puntuacionFinal })
                });

                if (response.ok) {
                    console.log(`🚀 ¡Misión completada! ${puntuacionFinal} puntos guardados.`);
                }
            } catch (error) {
                console.error("Error de comunicación con la base de datos:", error);
            }
        };

        // Suscribimos las funciones a los eventos de Phaser
        EventBus.on('game-started', handleGameStarted);
        EventBus.on('game-over', handleGameOver);

        // Limpieza de eventos al desmontar
        return () => {
            EventBus.removeListener('game-started', handleGameStarted);
            EventBus.removeListener('game-over', handleGameOver);
        };
    }, [token]); // Si el token cambia (iniciar/cerrar sesión), se actualizan los listeners, pero NO se reinicia el juego

    return (
        <div className="w-full h-full relative flex items-center justify-center bg-black/90">
            <h2 className="absolute top-4 left-4 z-10 text-primario font-bold bg-white/80 px-4 py-1 rounded-lg shadow">
                📡 {gameStatus}
            </h2> 
            
            <div ref={gameRef} id="phaser-container" className="w-full h-full flex items-center justify-center" />
        </div>
    );
};

export default GameComponent;