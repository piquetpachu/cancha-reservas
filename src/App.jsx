import { BrowserRouter, Routes, Route } from "react-router-dom";
//import ProtectedRoute from './components/ProtectedRoute'

import AdminSolicitudes from './pages/AdminSolicitudes'
import AdminRoute from "./components/AdminRoute";
import DashboardAdmin from "./pages/DashboardAdmin";
import AdminClubes from "./pages/AdminClubes";



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
import BloqueosHorarios from "./pages/BloqueosHorarios";
import ReservasDueno from "./pages/ReservasDueno";

import './App.css'

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* CLIENTE */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/home" element={<ClubList />} />
        <Route path="/club/:id" element={<ClubDetalle />} />
        <Route path="/reserva/:id" element={<Reserva />} />

        {/* PERFIL */}
        <Route path="/profile" element={<Profile />} />

        {/* DUEÑO */}
        <Route path="/crear-club" element={<CrearClub />} />
        <Route path="/crear-cancha" element={<CrearCancha />} />
        <Route path="/dashboard-dueno" element={<DashboardDueno />} />
        <Route path="/club-dueno/:id" element={<ClubDetalleDueno />} />
        <Route path="/horarios/:id" element={<HorariosCancha />} />
        <Route path="/bloqueos/:id" element={<BloqueosHorarios />} />
        <Route path="/reservas-dueno/:id" element={<ReservasDueno />} />

        {/* ADMIN */}
        <Route path="/admin/solicitudes" element={<AdminRoute> <AdminSolicitudes /></AdminRoute>}/>
        <Route path="/admin" element={<AdminRoute> <DashboardAdmin /> </AdminRoute> }/>
        <Route
          path="/admin/clubes" element={<AdminRoute> <AdminClubes />  </AdminRoute>}/>
          
           
              
           
         

      </Routes>

    </BrowserRouter>
  );
}

export default App;