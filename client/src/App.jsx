import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Register from './pages/Register'
import Ranking from './pages/Ranking'
import Profile from './pages/Profile'
import Login from './pages/Login'

function App() {
 
  return (
    <BrowserRouter>
    <Navbar></Navbar>
    <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/registro" element={<Register />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/perfil" element={<Profile />} />
    </Routes>
    
    
    </BrowserRouter>
  )
}

export default App
