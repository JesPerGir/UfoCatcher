import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenAuth }) {
  const { user, logout } = useAuth(); 

  return (
    <nav className="bg-white border-b border-gray-300 w-full p-4 sticky top-0 z-50">
      <div className="w-full flex justify-between items-center px-2 md:px-8">
        
        {/* IZQUIERDA: Logo */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="transition-transform hover:scale-105">
            <img 
              src={logo} 
              alt="Logo UfoCatcher" 
              className="h-12 w-auto object-contain mix-blend-multiply" 
            />
          </Link>
        </div>

        {/* CENTRO: Ranking Global */}
        <div className="hidden md:flex flex-none justify-center">
          <Link to="/ranking" className="border border-texto text-texto px-5 py-1.5 rounded-full font-semibold hover:border-primario hover:text-primario transition-colors">
            Ranking Global
          </Link>
        </div>

        {/* DERECHA: Autenticación / Perfil */}
        <div className="flex-1 flex justify-end">
          {!user ? (
            <div className="flex gap-4 font-semibold text-sm">
              <button 
                onClick={() => onOpenAuth('login')}
                className="border border-texto text-texto px-4 py-2 rounded hover:border-primario hover:text-primario transition-colors"
              >
                Iniciar Sesión
              </button>
              
              <button 
                onClick={() => onOpenAuth('register')}
                className="border border-primario bg-primario text-white px-4 py-2 rounded hover:bg-secundario hover:border-secundario transition-colors shadow-sm"
              >
                Registrarse
              </button>
            </div>
          ) : (
            // ZONA DE PERFIL
            <div className="flex items-center gap-6">
              
              {/* Agrupa Nombre + Avatar */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold leading-none">Piloto</p>
                  <p className="text-sm font-bold text-texto leading-tight">{user.username}</p>
                </div>
                
                {/* Avatar Placeholder: Círculo con Inicial */}
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primario to-secundario flex items-center justify-center shadow-sm border-2 border-white ring-1 ring-gray-100">
                  <span className="text-white font-black text-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Botón Salir */}
              <button 
                onClick={logout}
                className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-tighter border-b border-transparent hover:border-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
        
      </div>
    </nav>
  );
}