import { createContext, useState, useEffect, useContext } from 'react';

// 1. Creamos el contexto
const AuthContext = createContext();

// 2. Creamos el proveedor (el que envuelve la app)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Al cargar la app, comprobamos si hay un token guardado en el navegador
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Función para iniciar sesión (guarda en estado y en localStorage)
    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Función para cerrar sesión
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);