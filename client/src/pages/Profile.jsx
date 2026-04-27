import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export default function Profile() {
  const { user, token } = useAuth();
  
  const [historial, setHistorial] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ password: '', confirmPassword: '' });
  const [mensaje, setMensaje] = useState(null);
  const [descargando, setDescargando] = useState(false);

  const tablaRef = useRef(null);

  if (!user) return <Navigate to="/" />;

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/puntuaciones/historial', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setHistorial(data);
        } else {
          setHistorial([
            { _id: 1, puntos: 14500, fecha: new Date().toISOString() },
            { _id: 2, puntos: 12200, fecha: new Date(Date.now() - 86400000).toISOString() },
            { _id: 3, puntos: 8900, fecha: new Date(Date.now() - 172800000).toISOString() },
          ]);
        }
      } catch (error) {
        console.error('Error al cargar historial', error);
      }
    };

    fetchHistorial();
  }, [token]);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (editForm.password !== editForm.confirmPassword) {
      setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden' });
      return;
    }
    
    setMensaje({ tipo: 'exito', texto: 'Perfil actualizado con éxito (Simulado)' });
    setIsEditing(false);
    setEditForm({ password: '', confirmPassword: '' });
  };

  const exportarPDF = async () => {
    setDescargando(true);
    
    // Espera 100ms a React para que aplique la clase 'overflow-hidden' y quite la barra de scroll de la pantalla
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const element = tablaRef.current;
      if (!element) return;

      const width = element.offsetWidth;
      const height = element.offsetHeight;

      const dataUrl = await toPng(element, {
        backgroundColor: '#ffffff',
        pixelRatio: 2, 
        style: {
          transform: 'scale(1)', 
          transformOrigin: 'top left'
        }
      });
      
      const pdfPhysicalWidth = 280; 
      const pdfPhysicalHeight = (height / width) * pdfPhysicalWidth;

      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'mm', 
        format: [pdfPhysicalWidth, pdfPhysicalHeight]
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfPhysicalWidth, pdfPhysicalHeight);
      
      pdf.save(`UfoCatcher_Historial_${user.username}.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-4xl font-black text-primario mb-8 tracking-tight">
        Panel de Control del Piloto
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="h-24 w-full bg-gradient-to-r from-primario to-secundario"></div>
            
            <div className="px-6 pb-6">
              <div className="relative z-10 -mt-12 mb-4 h-24 w-24 rounded-full bg-white p-1.5 shadow-lg">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-primario to-secundario flex items-center justify-center border-2 border-white ring-1 ring-gray-100">
                  <span className="text-white font-black text-4xl drop-shadow-md">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
                <p className="text-gray-500 text-sm mb-6">{user.email}</p>

                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2 border-2 border-primario text-primario font-bold rounded-lg hover:bg-primario hover:text-white transition-colors shadow-sm"
                  >
                    Editar Perfil
                  </button>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-4 animate-slide-up">
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Cambiar Contraseña</p>
                      <input 
                        type="password" name="password" placeholder="Nueva contraseña"
                        value={editForm.password} onChange={handleEditChange}
                        className="w-full mb-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-primario outline-none text-sm"
                      />
                      <input 
                        type="password" name="confirmPassword" placeholder="Confirmar nueva contraseña"
                        value={editForm.confirmPassword} onChange={handleEditChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-primario outline-none text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-gray-200 text-gray-700 font-bold rounded hover:bg-gray-300 transition">
                        Cancelar
                      </button>
                      <button type="submit" className="flex-1 py-2 bg-primario text-white font-bold rounded hover:bg-secundario transition shadow-sm">
                        Guardar
                      </button>
                    </div>
                  </form>
                )}

                {mensaje && (
                  <div className={`mt-4 p-2 rounded text-sm text-center ${mensaje.tipo === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {mensaje.texto}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <div ref={tablaRef} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Últimas 10 Misiones</h3>
              <span className="bg-secundario/20 text-secundario text-xs font-bold px-3 py-1 rounded-full border border-secundario/30">
                Piloto: {user.username}
              </span>
            </div>

            {historial.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p>Aún no tienes registros de vuelo.</p>
                <p className="text-sm mt-1">¡Sube a la nave y juega tu primera partida!</p>
              </div>
            ) : (
              // 2. LA SOLUCIÓN: Si está descargando quitamos el scroll ('overflow-hidden'), si no lo dejamos normal ('overflow-x-auto')
              <div className={descargando ? "overflow-hidden" : "overflow-x-auto"}>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
                      <th className="pb-3 pl-2 font-semibold">Fecha de vuelo</th>
                      <th className="pb-3 text-right pr-2 font-semibold">Puntuación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((partida, index) => (
                      <tr key={partida._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 pl-2 text-gray-600 font-medium">
                          {new Date(partida.fecha).toLocaleDateString('es-ES', { 
                            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                          })}
                        </td>
                        <td className="py-4 text-right pr-2">
                          <span className={`font-black ${index === 0 ? 'text-secundario text-lg' : 'text-primario'}`}>
                            {partida.puntos.toLocaleString()} pts
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button 
              onClick={exportarPDF}
              disabled={descargando || historial.length === 0}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-sm
                ${descargando || historial.length === 0
                  ? 'border border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' 
                  : 'border border-primario text-primario hover:bg-primario hover:text-white hover:shadow-md hover:-translate-y-0.5'
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Exportar Historial PDF
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}