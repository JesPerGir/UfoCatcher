import { useState, useEffect } from 'react';
import GameComponent from '../components/GameComponent'; 

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Bloquea el scroll cuando el juego está activo
    if (isPlaying) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isPlaying]);

  return (
    <div className={`w-full bg-fondo relative flex flex-col items-center justify-center ${!isPlaying ? 'min-h-[calc(100vh-74px)] p-4' : 'h-[calc(100vh-74px)]'}`}>
      
      {!isPlaying ? (
        <div className="flex flex-col items-center gap-12 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-black text-primario tracking-tight drop-shadow-sm">
            UfoCatcher
          </h1>
          <button 
            onClick={() => setIsPlaying(true)}
            className="w-48 h-48 bg-secundario text-white text-4xl font-bold rounded-full shadow-xl hover:scale-110 hover:bg-secundario/90 transition-all active:scale-95 flex items-center justify-center"
          >
            Jugar
          </button>
        </div>
      ) : (
        <div className="h-full w-full relative animate-fade-in bg-black">
            <GameComponent />
        </div>
      )}
      
    </div>
  );
}