import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', background: '#333', color: 'white', display: 'flex', gap: '15px' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Inicio</Link>
      <Link to="/ranking" style={{ color: 'white', textDecoration: 'none' }}>Ranking</Link>
      <Link to="/perfil" style={{ color: 'white', textDecoration: 'none' }}>Mi Perfil</Link>
      <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Iniciar Sesión</Link>
      <Link to="/registro" style={{ color: 'white', textDecoration: 'none' }}>Registro</Link>
    </nav>
  );
}