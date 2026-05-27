import { BrowserRouter, Routes, Route } from 'react-router-dom'

import DashboardLayout from './layouts/DashboardLayout'

// ADMIN
import AdminSolicitudes from './pages/AdminSolicitudes'
import AdminRoute from './components/AdminRoute'
import DashboardAdmin from './pages/DashboardAdmin'
import AdminClubes from './pages/AdminClubes'
import AdminUsuarios from './pages/AdminUsuarios'
import AdminUsuarioDetalle from './pages/AdminUsuarioDetalle'
import AdminClubDetalle from './pages/AdminClubDetalle'
import AdminCanchaDetalle from './pages/AdminCanchaDetalle'
import AdminReservas from './pages/AdminReservas'
import AdminEditarCancha from './pages/AdminEditarCancha'
import AdminHorariosCancha from './pages/AdminHorariosCancha'
import AdminBloqueos from './pages/AdminBloqueosCancha'
import AdminEstadisticas from './pages/AdminEstadisticas'

// AUTH
import Login from './pages/Login'

// CLIENTE
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import ClubList from './pages/Clublist'
import ClubDetalle from './pages/ClubDetalle'
import Reserva from './pages/Reserva'

// DUEÑO
import CrearClub from './pages/CrearClub'
import CrearCancha from './pages/CrearCancha'
import DashboardDueno from './pages/DashboardDueno'
import ClubDetalleDueno from './pages/ClubDetalleDueno'
import HorariosCancha from './pages/HorariosCancha'
import BloqueosHorarios from './pages/BloqueosHorarios'
import ReservasDueno from './pages/ReservasDueno'

// TORNEOS
import Torneos from './pages/torneos/Torneos'
import TorneoDetalle from './pages/torneos/TorneoDetalle'
import DashboardTorneos from './pages/torneos/DashboardTorneos'
import CrearTorneo from './pages/torneos/CrearTorneo'
import EditarTorneo from './pages/torneos/EditarTorneo'

import './App.css'

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* LOGIN SIN LAYOUT */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* APP CON LAYOUT */}
                <Route element={<DashboardLayout />}>

                    {/* CLIENTE */}
                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/home"
                        element={<ClubList />}
                    />

                    <Route
                        path="/club/:id"
                        element={<ClubDetalle />}
                    />

                    <Route
                        path="/reserva/:id"
                        element={<Reserva />}
                    />

                    {/* PERFIL */}
                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                    {/* DUEÑO */}
                    <Route
                        path="/crear-club"
                        element={<CrearClub />}
                    />

                    <Route
                        path="/crear-cancha"
                        element={<CrearCancha />}
                    />

                    <Route
                        path="/dashboard-dueno"
                        element={<DashboardDueno />}
                    />

                    <Route
                        path="/club-dueno/:id"
                        element={<ClubDetalleDueno />}
                    />

                    <Route
                        path="/horarios/:id"
                        element={<HorariosCancha />}
                    />

                    <Route
                        path="/bloqueos/:id"
                        element={<BloqueosHorarios />}
                    />

                    <Route
                        path="/reservas-dueno/:id"
                        element={<ReservasDueno />}
                    />

                    {/* TORNEOS */}
                    <Route
                        path="/torneos"
                        element={<Torneos />}
                    />

                    <Route
                        path="/torneos/:id"
                        element={<TorneoDetalle />}
                    />

                    <Route
                        path="/dashboard/torneos"
                        element={<DashboardTorneos />}
                    />

                    <Route
                        path="/dashboard/torneos/nuevo"
                        element={<CrearTorneo />}
                    />

                    <Route
                        path="/dashboard/torneos/:id/editar"
                        element={<EditarTorneo />}
                    />

                    {/* ADMIN */}
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <DashboardAdmin />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/solicitudes"
                        element={
                            <AdminRoute>
                                <AdminSolicitudes />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/clubes"
                        element={
                            <AdminRoute>
                                <AdminClubes />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/usuarios"
                        element={
                            <AdminRoute>
                                <AdminUsuarios />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/usuarios/:id"
                        element={
                            <AdminRoute>
                                <AdminUsuarioDetalle />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/club/:id"
                        element={
                            <AdminRoute>
                                <AdminClubDetalle />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/cancha/:id"
                        element={
                            <AdminRoute>
                                <AdminCanchaDetalle />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/reservas"
                        element={
                            <AdminRoute>
                                <AdminReservas />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/cancha/:id/editar"
                        element={
                            <AdminRoute>
                                <AdminEditarCancha />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/cancha/:id/horarios"
                        element={
                            <AdminRoute>
                                <AdminHorariosCancha />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/bloqueos"
                        element={
                            <AdminRoute>
                                <AdminBloqueos />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/estadisticas"
                        element={
                            <AdminRoute>
                                <AdminEstadisticas />
                            </AdminRoute>
                        }
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    )

}

export default App