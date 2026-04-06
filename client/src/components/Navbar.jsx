import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-300 w-full p-4">
      <div className="w-full flex justify-between items-center px-2 md:px-8">
        
        {/* IZQUIERDA: Logo del juego */}
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
          <Link to="/ranking" className="border border-texto text-texto px-5 py-1.5 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Ranking Global
          </Link>
        </div>

        {/* DERECHA: Enlaces de navegación */}
        <div className="flex-1 flex justify-end gap-4 font-semibold text-sm">
          <Link to="/login" className="border border-texto text-texto px-4 py-2 rounded hover:bg-gray-100 transition-colors">
            Iniciar Sesión
          </Link>
          <Link to="/registro" className="border border-texto text-texto px-4 py-2 rounded hover:bg-gray-100 transition-colors">
            Registrarse
          </Link>
        </div>
        
      </div>
    </nav>
  );
}