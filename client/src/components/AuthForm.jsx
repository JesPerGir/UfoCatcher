import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 

export default function AuthForm({ type, onClose, onSwitchType }) {
  const isLogin = type === 'login';
  const { login } = useAuth(); // Extrae la función login
  const [errorMsj, setErrorMsj] = useState(''); // Estado para mostrar errores
  
  const [formData, setFormData] = useState({
    username: '', 
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setErrorMsj('');

    // Validación básica de registro
    if (!isLogin && formData.password !== formData.confirmPassword) {
        return setErrorMsj('Las contraseñas no coinciden');
    }

    try {
        // Elige a qué endpoint del backend llamar
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        
        const response = await fetch(`http://localhost:3000${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error en la autenticación');
        }

        // Si todo va bien, guarda el token y el usuario en el contexto
        login(data.usuario, data.token);
        
        // Cierra la modal
        onClose();

    } catch (error) {
        setErrorMsj(error.message);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  return (
    <div onClick={handleBackdropClick} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-sm p-8 bg-white rounded-lg shadow-2xl border-t-4 border-primario text-texto animate-slide-up">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-secundario transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-primario">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isLogin ? 'Prepárate para la abducción' : 'Únete al ranking intergaláctico'}
          </p>
        </div>

        {/* Muestra EL ERROR SI LO HAY */}
        {errorMsj && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded text-center">
                {errorMsj}
            </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Nombre de jugador</label>
              <input type="text" name="username" placeholder="Ej: PilotoX" value={formData.username} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-primario outline-none" required />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Correo electrónico</label>
            <input type="email" name="email" placeholder="tu@email.com" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-primario outline-none" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Contraseña</label>
            <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-primario outline-none" required />
          </div>
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Confirmar Contraseña</label>
              <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-primario outline-none" required />
            </div>
          )}
          <button type="submit" className="w-full py-2 mt-2 bg-primario text-white rounded font-bold hover:bg-secundario transition-colors shadow-sm">
            {isLogin ? 'Entrar' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button onClick={() => onSwitchType(isLogin ? 'register' : 'login')} type="button" className="ml-1 text-primario hover:text-secundario font-bold transition-colors">
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
        </p>
      </div>
    </div>
  );
}