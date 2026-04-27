import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Phaser from 'phaser';
import config from '../game/config';
import EventBus from '../game/EventBus';
import { useAuth } from '../context/AuthContext';

const GameComponent = () => {
    const gameRef = useRef(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const phaserGame = new Phaser.Game({
            ...config,
            parent: gameRef.current
        });

        // Limpieza al desmontar: Destruye la instancia para resetear tiempos y memoria
        return () => {
            if (phaserGame) {
                phaserGame.destroy(true);
            }
        };
    }, []);

    useEffect(() => {
        const handleGameOver = async (puntuacionFinal) => {
            if (!token) return;
            try {
                await fetch('http://localhost:3000/api/puntuaciones', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ puntos: puntuacionFinal })
                });
            } catch (error) {
                console.error("Error al guardar puntos:", error);
            }
        };

        EventBus.on('game-over', handleGameOver);
        EventBus.on('go-to-ranking', () => navigate('/ranking'));

        return () => {
            EventBus.removeListener('game-over');
            EventBus.removeListener('go-to-ranking');
        };
    }, [token, navigate]);

    return (
        <div ref={gameRef} className="w-full h-full" />
    );
};

export default GameComponent;