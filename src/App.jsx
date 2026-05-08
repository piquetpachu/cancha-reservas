import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CrearClub from "./pages/CrearClub";
import CrearCancha from "./pages/CrearCancha";
import ClubList from "./pages/Clublist";
import ClubDetalle from "./pages/ClubDetalle";
import Reserva from "./pages/Reserva";
import DashboardDueno from "./pages/DashboardDueno";
import ClubDetalleDueno from "./pages/ClubDetalleDueno";
import HorariosCancha from "./pages/HorariosCancha";
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
        <Route path="/home" element={<ClubList />} />
        <Route path="/club/:id" element={<ClubDetalle />} />
        <Route path="/reserva/:id" element={<Reserva />} />
        <Route path="/dashboard-dueno" element={<DashboardDueno />} />
        <Route path="/club-dueno/:id" element={<ClubDetalleDueno />} />
        <Route path="/horarios/:id" element={<HorariosCancha />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;