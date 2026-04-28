import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CrearClub from "./pages/CrearClub";
import CrearCancha from "./pages/CrearCancha";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/crear-club" element={<CrearClub />} />
        <Route path="/crear-cancha" element={<CrearCancha />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;