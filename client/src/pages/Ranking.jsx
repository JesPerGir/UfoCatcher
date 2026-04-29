import { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image'; // Usamos la nueva librería
import { jsPDF } from 'jspdf';

export default function Ranking() {
  const [puntuaciones, setPuntuaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [descargando, setDescargando] = useState(false);
  
  const tablaRef = useRef(null);

  useEffect(() => {
    const obtenerRanking = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/puntuaciones/ranking');
        const datos = await respuesta.json();
        setPuntuaciones(datos);
        setCargando(false);
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        setCargando(false);
      }
    };

    obtenerRanking();
  }, []);

const exportarPDF = async () => {
    setDescargando(true);
    try {
      const element = tablaRef.current;
      if (!element) return;

      // Obtiene las proporciones reales de la tabla en pantalla
      const width = element.offsetWidth;
      const height = element.offsetHeight;

      // Hacemos la foto en alta resolución (doble de píxeles)
      const dataUrl = await toPng(element, {
        backgroundColor: '#1D0C2E',
        pixelRatio: 2, 
        style: {
          transform: 'scale(1)', 
          transformOrigin: 'top left'
        }
      });
      
      // Define un tamaño físico para el PDF (280 milímetros)
      const pdfPhysicalWidth = 280; 
      // Calcula la altura para que mantenga la proporción exacta sin deformarse
      const pdfPhysicalHeight = (height / width) * pdfPhysicalWidth;

      // Crea el PDF usando milímetros, con el tamaño que acaba de calcular
      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'mm', 
        format: [pdfPhysicalWidth, pdfPhysicalHeight]
      });

      // Pega la imagen en ese folio pequeñito
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfPhysicalWidth, pdfPhysicalHeight);
      
      pdf.save('UfoCatcher_Ranking_Global.pdf');
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="p-8 min-h-[calc(100vh-74px)] bg-white animate-fade-in">
      <div className="max-w-5xl mx-auto">
        
        <h2 className="text-5xl font-black text-primario mb-10 uppercase tracking-tighter text-center drop-shadow-[0_0_10px_rgba(104,41,158,0.3)]">
          🛸 Mejores Pilotos 🏆
        </h2>
        
        {cargando ? (
          <div className="flex flex-col items-center justify-center p-20">
            <div className="w-12 h-12 border-4 border-primario border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-primario animate-pulse font-bold tracking-widest">
              SINCRONIZANDO SATÉLITES...
            </p>
          </div>
        ) : (
          <>
            <div ref={tablaRef} className="bg-[#1D0C2E] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-primario/30">
              
              <table className="w-full text-left border-separate" style={{ borderSpacing: 0 }}>
                <thead>
                  <tr className="bg-primario text-white uppercase tracking-[0.2em] text-xs">
                    <th className="p-6 text-center w-24 rounded-tl-[1.3rem]">Pos</th>
                    <th className="p-6 text-left">Piloto</th>
                    <th className="p-6 text-center">Puntuación</th>
                    <th className="p-6 hidden md:table-cell text-center">Misión</th>
                    <th className="p-6 text-center rounded-tr-[1.3rem]">Fecha</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {puntuaciones.map((p, index) => {
                    
                    const fechaFormateada = new Date(p.fecha).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }).replace(/\//g, '-');
                    
                    // Asegura que la última fila redondee la parte inferior
                    const isLast = index === puntuaciones.length - 1;
                    
                    return (
                      <tr 
                        key={p._id} 
                        className={`hover:bg-white/[0.03] transition-all duration-300 group ${!isLast ? 'border-b border-white/5' : ''}`}
                      >
                        <td className={`p-6 text-center ${!isLast ? 'border-b border-white/5' : 'rounded-bl-[1.3rem]'}`}>
                          {index === 0 ? (
                            <span className="text-3xl drop-shadow-[0_0_15px_rgba(249,163,90,0.8)]">🥇</span>
                          ) : index === 1 ? (
                            <span className="text-3xl drop-shadow-[0_0_15px_rgba(156,163,175,0.5)]">🥈</span>
                          ) : index === 2 ? (
                            <span className="text-3xl drop-shadow-[0_0_15px_rgba(205,127,50,0.5)]">🥉</span>
                          ) : (
                            <span className="text-secundario font-black font-mono text-xl">
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </span>
                          )}
                        </td>
                        
                        <td className={`p-6 text-left ${!isLast ? 'border-b border-white/5' : ''}`}>
                          <div className="flex items-center gap-3">
                            <div className={`h-2 w-2 rounded-full ${index < 3 ? 'bg-secundario animate-ping' : 'bg-primario/50'}`}></div>
                            <span className={`text-xl font-bold tracking-tight ${index < 3 ? 'text-white' : 'text-gray-400'}`}>
                              {p.usuario}
                            </span>
                          </div>
                        </td>
                        
                        <td className={`p-6 text-center ${!isLast ? 'border-b border-white/5' : ''}`}>
                          <span className="font-mono text-2xl font-black text-secundario tracking-tighter drop-shadow-[0_0_8px_rgba(249,163,90,0.4)]">
                            {p.puntos.toLocaleString()}
                          </span>
                          <span className="ml-2 text-[10px] text-secundario/50 font-bold">PTS</span>
                        </td>

                        <td className={`p-6 hidden md:table-cell text-center ${!isLast ? 'border-b border-white/5' : ''}`}>
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primario/10 border border-primario/30">
                            <div className="w-1.5 h-1.5 rounded-full bg-primario/80"></div>
                            <span className="text-xs font-mono text-gray-300 tracking-widest uppercase">
                              ID-{p._id.substring(p._id.length - 4)}
                            </span>
                          </div>
                        </td>
                        
                        <td className={`p-6 text-center ${!isLast ? 'border-b border-white/5' : 'rounded-br-[1.3rem]'}`}>
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-secundario/10 border border-secundario/30">
                            <div className="w-1.5 h-1.5 rounded-full bg-secundario/80"></div>
                            <span className="text-xs font-mono text-gray-300 tracking-widest">
                              {fechaFormateada}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {puntuaciones.length === 0 && (
                <div className="text-center p-20 text-primario/50 font-bold tracking-widest italic">
                  {">"} NO SE HAN DETECTADO SEÑALES DE VIDA EN EL RANKING {"<"}
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
              
              <div className="flex gap-8">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-secundario rounded-full"></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top Tier</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primario rounded-full"></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Piloto Experto</span>
                </div>
              </div>

              <button 
                onClick={exportarPDF}
                disabled={descargando || puntuaciones.length === 0}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-md border-2 font-bold text-xs uppercase tracking-widest transition-all
                  ${descargando 
                    ? 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed' 
                    : 'border-primario text-primario hover:bg-primario hover:text-white shadow-sm hover:shadow-lg hover:-translate-y-0.5'
                  }`}
              >
                {descargando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Exportar Registro PDF
                  </>
                )}
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  );
}