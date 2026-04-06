import { useState, useEffect } from 'react';

export default function Ranking() {
  const [puntuaciones, setPuntuaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerRanking = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/puntuaciones');
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

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        
        <h2 className="text-3xl font-black text-primario mb-8 uppercase tracking-wider text-center drop-shadow-sm">
          🏆 Ranking Global 🏆
        </h2>
        
        {cargando ? (
          <p className="text-center text-primario animate-pulse font-semibold">
            Cargando datos espaciales...
          </p>
        ) : (
          // Aquí empieza la "pantalla arcade"
          <div className="bg-[#1D0C2E] rounded-2xl shadow-2xl overflow-hidden border-2 border-primario/50">
            <table className="w-full text-left border-collapse">
              <thead>
                {/* Cabecera con color morado principal */}
                <tr className="bg-primario text-white uppercase tracking-widest text-sm">
                  <th className="p-4 text-center">Posición</th>
                  <th className="p-4">Jugador</th>
                  <th className="p-4">Puntuación</th>
                  <th className="p-4">Tiempo</th>
                  <th className="p-4">Fecha</th>
                </tr>
              </thead>
              <tbody className="text-gray-200">
                {puntuaciones.map((p, index) => {
                  const fechaFormateada = new Date(p.fecha).toLocaleDateString('es-ES');
                  
                  return (
                    <tr 
                      key={index} 
                      // Fila con borde morado y efecto hover que la ilumina
                      className="border-b border-primario/20 hover:bg-primario/30 transition-colors"
                    >
                      <td className="p-4 text-center text-xl">
                        {/* Medallas para el Top 3, y color naranja para el resto de posiciones */}
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (
                          <span className="text-secundario font-bold">#{index + 1}</span>
                        )}
                      </td>
                      <td className="p-4 font-semibold text-white">{p.usuario}</td>
                      <td className="p-4 font-mono text-secundario font-bold text-lg tracking-wider drop-shadow-md">
                        {/* La puntuación usa fuente monoespaciada y color naranja */}
                        {p.puntos}
                      </td>
                      <td className="p-4 text-gray-400 font-mono text-sm">
                        --:--
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {fechaFormateada}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {puntuaciones.length === 0 && (
              <div className="text-center p-8 text-primario/70 font-semibold">
                Aún no hay puntuaciones registradas.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}