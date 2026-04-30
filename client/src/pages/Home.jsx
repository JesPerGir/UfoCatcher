import { useState, useEffect } from 'react';
import GameComponent from '../components/GameComponent'; 
import './Home.css'; 

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Fuerza que NUNCA haya scroll 
    document.body.style.overflow = 'hidden';
    
    // Desactiva el "pinch-to-zoom" en trackpads y pantallas táctiles
    document.body.style.touchAction = 'none';

    // Intercepta el teclado (Ctrl + '+', Ctrl + '-', Ctrl + '=')
    const preventKeyboardZoom = (e) => {
      if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
        e.preventDefault();
      }
    };

    // Intercepta la rueda del ratón (Ctrl + Scroll)
    const preventWheelZoom = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Añade los event listeners a la ventana (window)
    window.addEventListener('keydown', preventKeyboardZoom);
    window.addEventListener('wheel', preventWheelZoom, { passive: false });

    return () => {
      // Restaura todo a la normalidad al desmontar el componente
      document.body.style.overflow = 'auto';
      document.body.style.touchAction = 'auto';
      window.removeEventListener('keydown', preventKeyboardZoom);
      window.removeEventListener('wheel', preventWheelZoom);
    };
  }, []);

  return (
    <div className="w-full bg-fondo relative flex flex-col items-center overflow-hidden h-[calc(100vh-74px)]">
      
      {!isPlaying ? (
        <>
          <div className="fondo-animado"></div>

          {/* Aplica px-4 para proteger el texto de los bordes laterales */}
          <div className="z-10 flex flex-col items-center w-full h-full animate-fade-in relative px-4">
            
            <div className="flex-1 min-h-[1rem]"></div>
            
            <h1 className="titulo-arcade shrink-0 text-[clamp(3rem,10vmin,6rem)] md:text-[clamp(4rem,12vmin,8rem)] font-black tracking-tight text-center w-full">
              UfoCatcher
            </h1>
            
            <div className="flex-1 min-h-[2rem]"></div>
            
            <button 
              onClick={() => setIsPlaying(true)}
              className="boton-cristal flex items-center justify-center shrink-0"
            >
              Jugar
            </button>
            
            <div className="flex-[2] min-h-[2rem]"></div>
            
          </div>
        </>
      ) : (
        <div className="h-full w-full relative animate-fade-in bg-black">
            <GameComponent />
        </div>
      )}
      
    </div>
  );
}