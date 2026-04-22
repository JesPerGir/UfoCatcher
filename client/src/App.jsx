import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Ranking from './pages/Ranking';
import Profile from './pages/Profile';
import AuthForm from './components/AuthForm';

function App() {
  // Estado para controlar la modal: null (cerrada), 'login' o 'register'
  const [authModal, setAuthModal] = useState(null);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-fondo text-white font-sans selection:bg-primario selection:text-white relative">
        {/* Pasa la función a la Navbar para que los botones puedan abrir la modal */}
        <Navbar onOpenAuth={(type) => setAuthModal(type)} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/perfil" element={<Profile />} />
          </Routes>
        </main>

        {/* Si authModal tiene un valor, renderiza la modal por encima de todo */}
        {authModal && (
          <AuthForm 
            type={authModal} 
            onClose={() => setAuthModal(null)} 
            onSwitchType={(type) => setAuthModal(type)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
