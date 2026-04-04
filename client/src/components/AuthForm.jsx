import { useState } from 'react';

// Se recibe 'isLogin' como prop para mostrar el diseño de Login o de Registro
export default function AuthForm({ isLogin }) {
  
  const [formData, setFormData] = useState({
    username: '', 
    email: '',
    password: ''
  });

  // Se ejecuta cada vez que el usuario teclea algo en un input
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Actualizamos el estado con lo que ya había (...formData) y modificando el campo actual
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Esta función se ejecuta al darle al botón de enviar
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue 
    console.log("Datos listos para enviar al backend:", formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '20px auto' }}>
      <h2>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>

      {/* Si NO es login (es decir, es registro), mostramos el campo de nombre de usuario */}
      {!isLogin && (
        <input
          type="text"
          name="username"
          placeholder="Nombre de jugador"
          value={formData.username}
          onChange={handleChange}
          required
        />
      )}

      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
        {isLogin ? 'Entrar' : 'Registrarse'}
      </button>
    </form>
  );
}