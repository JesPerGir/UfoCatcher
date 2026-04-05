import { useState, useEffect } from 'react';

export default function Ranking() {

  const [puntuaciones, setPuntuaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  // useEffect que ejecuta código secundario (como llamadas al servidor)
  useEffect(() => {
    const obtenerRanking = async () => {
      try {
        // Usa fetch para llamar al backend
        const respuesta = await fetch('http://localhost:3000/api/puntuaciones');
        const datos = await respuesta.json(); // Convierte la respuesta a JSON
        
        setPuntuaciones(datos); // Guarda los datos en el estado de React
        setCargando(false);     // Quita el mensaje de "Cargando"
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        setCargando(false);
      }
    };

    obtenerRanking();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Top 10 Global</h2>
      
      {cargando ? (
        <p>Cargando las puntuaciones de los pilotos...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ background: '#333', color: 'white' }}>
              <th style={{ padding: '10px' }}>Posición</th>
              <th style={{ padding: '10px' }}>Jugador</th>
              <th style={{ padding: '10px' }}>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {/* Recorre el array de puntuaciones y crea una fila por cada una */}
            {puntuaciones.map((p, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{index + 1}</td>
                <td style={{ padding: '10px' }}>{p.usuario}</td>
                <td style={{ padding: '10px' }}>{p.puntos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}