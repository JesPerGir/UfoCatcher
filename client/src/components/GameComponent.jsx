import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import config from '../game/config';
import EventBus from '../game/EventBus';

const GameComponent = () => {
    const gameRef = useRef(null);
    const [gameStatus, setGameStatus] = useState('Cargando señales espaciales...'); 

    useEffect(() => {
        // 1. Inicializa el juego inyectándolo en el div
        const phaserGame = new Phaser.Game({
            ...config,
            parent: gameRef.current
        });

        // 2. Escucha eventos que vengan desde Phaser (PlayScene.js)
        EventBus.on('game-started', (data) => {
            setGameStatus(data.message); 
        });

        // 3. Limpieza al desmontar el componente
        return () => {
            EventBus.removeListener('game-started'); 
            phaserGame.destroy(true); 
        };
    }, []);

    return (
        // El contenedor principal ahora ocupa TODO el alto y ancho disponible (w-full h-full)
        // relative permite poner elementos flotando por encima del juego
        <div className="w-full h-full relative flex items-center justify-center bg-black/90">
            
            {/* Título flotante (absolute) para no empujar el juego hacia abajo */}
            <h2 className="absolute top-4 left-4 z-10 text-primario font-bold bg-white/80 px-4 py-1 rounded-lg shadow">
                📡 {gameStatus}
            </h2> 
            
            {/* Contenedor del juego de Phaser */}
            {/* Le quita los bordes blancos inline y deja que Phaser mande */}
            <div ref={gameRef} id="phaser-container" className="w-full h-full flex items-center justify-center" />
        </div>
    );
};

export default GameComponent;