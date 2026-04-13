import { useState, useEffect } from 'react';
import GameComponent from '../components/GameComponent'; 

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
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
    // min-h-[calc(100vh-74px)] asegura que el fondo abarque toda la pantalla
    // permitiendo que justify-center coloque los elementos en el centro geométrico perfecto.
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
            
            <button 
              onClick={() => setIsPlaying(false)}
              className="absolute top-4 right-4 z-50 px-4 py-2 bg-white/80 backdrop-blur-sm border border-primario text-primario font-bold rounded-lg hover:bg-primario hover:text-white transition-all shadow-lg"
            >
              Escapar (ESC)
            </button>
        </div>
      )}
      
    </div>
  );
}