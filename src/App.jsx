import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Navbar from "./components/Navbar";
import NavbarDueno from "./components/NavbarDueno";

// ADMIN
import AdminSolicitudes from './pages/AdminSolicitudes'
import AdminRoute from "./components/AdminRoute";
import DashboardAdmin from "./pages/DashboardAdmin";
import AdminClubes from "./pages/AdminClubes";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminUsuarioDetalle from "./pages/AdminUsuarioDetalle";
import AdminClubDetalle from "./pages/AdminClubDetalle";
import AdminCanchaDetalle from "./pages/AdminCanchaDetalle";
import AdminReservas from "./pages/AdminReservas";
import AdminEditarCancha from "./pages/AdminEditarCancha";
import AdminHorariosCancha from "./pages/AdminHorariosCancha";
import AdminBloqueos from "./pages/AdminBloqueosCancha";
import AdminEstadisticas from "./pages/AdminEstadisticas";

// CLIENTE
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CrearClub from "./pages/CrearClub";
import CrearCancha from "./pages/CrearCancha";
import ClubList from "./pages/Clublist";
import ClubDetalle from "./pages/ClubDetalle";
import Reserva from "./pages/Reserva";

// DUEÑO
import DashboardDueno from "./pages/DashboardDueno";
import ClubDetalleDueno from "./pages/ClubDetalleDueno";
import HorariosCancha from "./pages/HorariosCancha";
import BloqueosHorarios from "./pages/BloqueosHorarios";
import ReservasDueno from "./pages/ReservasDueno";
import DuenoRoute from "./components/DuenoRoute";

//TORNEOS
// import Torneos from './pages/Torneos'
import CrearTorneo from './pages/torneos/CreateTournament'
import TorneoDetalle from './pages/torneos/TorneoDetalle'
import EditarTorneo from './pages/torneos/EditarTorneo'
import TournamentsHome from './pages/TournamentsHome'
import PadelHome from './pages/PadelHome'

//FUTBOL
import FutbolRanking from './pages/futbol/FutbolRanking'
import FutbolTorneos from './pages/futbol/FutbolTorneos'
import FutbolEquipos from './pages/futbol/FutbolEquipos'
import MisEquipos from './pages/futbol/MisEquipos'
import FutbolHome from './pages/futbol/FutbolHome'

import MisInvitaciones
from './pages/futbol/MisInvitaciones'
import CreateFootballTournament
from './pages/futbol/CreateFootballTournament'



import CreatePadelTournament
from './pages/padel/CreatePadelTournament'
import './App.css'
import EquipoDetalle
from './pages/futbol/EquipoDetalle'
function App() {

  const [rol, setRol] = useState(null);

  useEffect(() => {
    async function obtenerRol() {

      const { data: { user } } =
        await supabase.auth.getUser();

      if (!user) {
        setRol(null);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("rol")
        .eq("id", user.id)
        .single();

      if (data) {
        setRol(data.rol);
      }
    }

    obtenerRol();

  }, []);

  return (

    <BrowserRouter>

      {/* 🔥 NAVBAR GLOBAL */}
      {rol === "dueno"
        ? <NavbarDueno />
        : <Navbar />
      }

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

        <Route
          path="/dashboard-dueno"
          element={
            <DuenoRoute>
              <DashboardDueno />
            </DuenoRoute>
          }
        />

        <Route path="/club-dueno/:id" element={<ClubDetalleDueno />} />
        <Route path="/horarios/:id" element={<HorariosCancha />} />
        <Route path="/bloqueos/:id" element={<BloqueosHorarios />} />
        <Route path="/reservas-dueno/:id" element={<ReservasDueno />} />

        {/* ADMIN */}
        <Route path="/admin/solicitudes" element={<AdminRoute><AdminSolicitudes /></AdminRoute>} />
        <Route path="/admin" element={<AdminRoute><DashboardAdmin /></AdminRoute>} />
        <Route path="/admin/clubes" element={<AdminRoute><AdminClubes /></AdminRoute>} />
        <Route path="/admin/usuarios" element={<AdminRoute><AdminUsuarios /></AdminRoute>} />
        <Route path="/admin/usuarios/:id" element={<AdminRoute><AdminUsuarioDetalle /></AdminRoute>} />

        <Route path="/admin/club/:id" element={<AdminClubDetalle />} />
        <Route path="/admin/cancha/:id" element={<AdminRoute><AdminCanchaDetalle /></AdminRoute>} />
        <Route path="/admin/reservas" element={<AdminRoute><AdminReservas /></AdminRoute>} />

        <Route path="/admin/cancha/:id/editar" element={<AdminEditarCancha />} />
        <Route path="/admin/cancha/:id/horarios" element={<AdminHorariosCancha />} />
        <Route path="/admin/bloqueos" element={<AdminBloqueos />} />

        <Route path="/admin/estadisticas" element={<AdminRoute><AdminEstadisticas /></AdminRoute>} />
        {/* TORNEOS */}
        <Route path="/torneos"element={<TournamentsHome/>} />
        <Route path="/dashboard/torneos/nuevo"element={<CrearTorneo />}/>
        <Route path="/torneos/:id"element={<TorneoDetalle />}/>
        <Route path="/torneos/:id/editar"element={<EditarTorneo />}/>
        
<Route
  path="/torneos/futbol/invitaciones"
  element={<MisInvitaciones />}
/>
        <Route
          path="/torneos/padel"
          element={<PadelHome />}
        />
        {/* FUTBOL */}
        <Route
  path="/torneos/futbol/ranking"
  element={<FutbolRanking />}
/>

<Route
  path="/torneos/futbol/torneos"
  element={<FutbolTorneos />}
/>

<Route
  path="/torneos/futbol/equipos"
  element={<FutbolEquipos />}
/>

<Route
  path="/torneos/futbol/mis-equipos"
  element={<MisEquipos />}
/>
<Route
  path="/torneos/futbol"
  element={<FutbolHome />}
/>
<Route
  path="/torneos/futbol/nuevo"
  element={
    <CreateFootballTournament />
  }
/>

<Route
  path="/torneos/padel/nuevo"
  element={
    <CreatePadelTournament />
  }
/>
<Route
  path="/torneos/futbol/equipo/:id"
  element={<EquipoDetalle />}
/>
      </Routes>


    </BrowserRouter>
  );
}

export default App;