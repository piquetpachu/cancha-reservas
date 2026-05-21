import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminEstadisticas() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [usuarios, setUsuarios] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [canchas, setCanchas] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [bloqueos, setBloqueos] = useState([]);

    const [filtroPeriodo, setFiltroPeriodo] = useState("mes");

    useEffect(() => {

        cargarDatos();

    }, []);

    async function cargarDatos() {

        setLoading(true);

        // =========================
        // USUARIOS
        // =========================

        const {
            data: usuariosData,
            error: usuariosError
        } = await supabase
            .from("profiles")
            .select("*");

        if (usuariosError) {

            console.log(usuariosError);

        } else {

            setUsuarios(usuariosData || []);
        }

        // =========================
        // CLUBS
        // =========================

        const {
            data: clubsData,
            error: clubsError
        } = await supabase
            .from("clubs")
            .select("*");

        if (clubsError) {

            console.log(clubsError);

        } else {

            setClubs(clubsData || []);
        }

        // =========================
        // CANCHAS
        // =========================

        const {
            data: canchasData,
            error: canchasError
        } = await supabase
            .from("canchas")
            .select("*");

        if (canchasError) {

            console.log(canchasError);

        } else {

            setCanchas(canchasData || []);
        }

        // =========================
        // RESERVAS
        // =========================

        const {
            data: reservasData,
            error: reservasError
        } = await supabase
            .from("reservas")
            .select(`
                *,
                canchas (
                    nombre,
                    deporte
                )
            `);

        if (reservasError) {

            console.log(reservasError);

        } else {

            setReservas(reservasData || []);
        }

        // =========================
        // BLOQUEOS
        // =========================

        const {
            data: bloqueosData,
            error: bloqueosError
        } = await supabase
            .from("bloqueos_horarios")
            .select("*");

        if (bloqueosError) {

            console.log(bloqueosError);

        } else {

            setBloqueos(bloqueosData || []);
        }

        setLoading(false);
    }

    // =========================
    // FECHAS
    // =========================

    const hoy = new Date();

    function dentroDelPeriodo(fecha) {

        const fechaReserva = new Date(fecha);

        const diff =
            hoy.getTime() - fechaReserva.getTime();

        const dias =
            diff / (1000 * 60 * 60 * 24);

        if (filtroPeriodo === "hoy") {

            return (
                fechaReserva.toDateString() ===
                hoy.toDateString()
            );
        }

        if (filtroPeriodo === "semana") {

            return dias <= 7;
        }

        if (filtroPeriodo === "mes") {

            return dias <= 30;
        }

        return true;
    }

    // =========================
    // RESERVAS FILTRADAS
    // =========================

    const reservasFiltradas = useMemo(() => {

        return reservas.filter((r) =>
            dentroDelPeriodo(r.fecha)
        );

    }, [reservas, filtroPeriodo]);

    // =========================
    // TOTALES
    // =========================

    const totalUsuarios = usuarios.length;

    const totalClientes =
        usuarios.filter(
            (u) => u.rol === "cliente"
        ).length;

    const totalDuenos =
        usuarios.filter(
            (u) => u.rol === "dueno"
        ).length;

    const totalAdmins =
        usuarios.filter(
            (u) => u.rol === "admin"
        ).length;

    const totalClubs = clubs.length;

    const clubsActivos =
        clubs.filter(
            (c) => c.habilitacion !== "eliminado"
        ).length;

    const totalCanchas = canchas.length;

    const canchasActivas =
        canchas.filter(
            (c) => c.habilitacion !== "eliminado"
        ).length;

    const reservasActivas =
        reservasFiltradas.filter(
            (r) => r.estado !== "cancelada"
        ).length;

    const reservasCanceladas =
        reservasFiltradas.filter(
            (r) => r.estado === "cancelada"
        ).length;

    const totalBloqueos =
        bloqueos.length;

    // =========================
    // DEPORTES MÁS USADOS
    // =========================

    const deportesMap = {};

    reservasFiltradas.forEach((r) => {

        const deporte =
            r.canchas?.deporte || "Sin deporte";

        deportesMap[deporte] =
            (deportesMap[deporte] || 0) + 1;
    });

    const deportesOrdenados =
        Object.entries(deportesMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

    // =========================
    // HORARIOS PICO
    // =========================

    const horasMap = {};

    reservasFiltradas.forEach((r) => {

        const hora =
            r.hora_inicio || "00:00";

        horasMap[hora] =
            (horasMap[hora] || 0) + 1;
    });

    const horasOrdenadas =
        Object.entries(horasMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

    // =========================
    // CANCHAS MÁS USADAS
    // =========================

    const canchasMap = {};

    reservasFiltradas.forEach((r) => {

        const cancha =
            r.canchas?.nombre || "Cancha";

        canchasMap[cancha] =
            (canchasMap[cancha] || 0) + 1;
    });

    const canchasOrdenadas =
        Object.entries(canchasMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    background: "#121212",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white"
                }}
            >
                Cargando estadísticas...
            </div>
        );
    }

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#121212",
                color: "white",
                padding: "14px",
                boxSizing: "border-box"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "20px"
                }}
            >

                <div>

                    <h1
                        style={{
                            margin: 0,
                            fontSize: "24px"
                        }}
                    >
                        Estadísticas
                    </h1>

                    <p
                        style={{
                            marginTop: "5px",
                            color: "#9e9e9e",
                            fontSize: "13px"
                        }}
                    >
                        Panel global del sistema
                    </p>

                </div>

                <button
                    onClick={() =>
                        navigate(-1)
                    }
                    style={{
                        background: "#1f1f1f",
                        border: "1px solid #2e2e2e",
                        color: "white",
                        borderRadius: "10px",
                        padding: "10px 14px",
                        cursor: "pointer"
                    }}
                >
                    Volver
                </button>

            </div>

            {/* FILTROS */}

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    overflowX: "auto",
                    marginBottom: "20px"
                }}
            >

                {[
                    "hoy",
                    "semana",
                    "mes",
                    "todo"
                ].map((p) => (

                    <button
                        key={p}
                        onClick={() =>
                            setFiltroPeriodo(p)
                        }
                        style={{
                            background:
                                filtroPeriodo === p
                                    ? "#1565c0"
                                    : "#1e1e1e",
                            border: "1px solid #333",
                            color: "white",
                            borderRadius: "12px",
                            padding: "10px 16px",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            fontWeight: "700"
                        }}
                    >
                        {p.toUpperCase()}
                    </button>

                ))}

            </div>

            {/* CARDS */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: "14px",
                    marginBottom: "24px"
                }}
            >

                <Card
                    titulo="Usuarios"
                    valor={totalUsuarios}
                />

                <Card
                    titulo="Clientes"
                    valor={totalClientes}
                />

                <Card
                    titulo="Dueños"
                    valor={totalDuenos}
                />

                <Card
                    titulo="Admins"
                    valor={totalAdmins}
                />

                <Card
                    titulo="Clubs"
                    valor={totalClubs}
                />

                <Card
                    titulo="Clubs activos"
                    valor={clubsActivos}
                />

                <Card
                    titulo="Canchas"
                    valor={totalCanchas}
                />

                <Card
                    titulo="Canchas activas"
                    valor={canchasActivas}
                />

                <Card
                    titulo="Reservas"
                    valor={reservasActivas}
                />

                <Card
                    titulo="Canceladas"
                    valor={reservasCanceladas}
                />

                <Card
                    titulo="Bloqueos"
                    valor={totalBloqueos}
                />

            </div>

            {/* TOPS */}

            <Section titulo="Deportes más reservados">

                {deportesOrdenados.length === 0 ? (

                    <Vacio />

                ) : (

                    deportesOrdenados.map((d) => (

                        <ItemRanking
                            key={d[0]}
                            nombre={d[0]}
                            valor={d[1]}
                        />

                    ))
                )}

            </Section>

            <Section titulo="Horarios pico">

                {horasOrdenadas.length === 0 ? (

                    <Vacio />

                ) : (

                    horasOrdenadas.map((h) => (

                        <ItemRanking
                            key={h[0]}
                            nombre={h[0]}
                            valor={h[1]}
                        />

                    ))
                )}

            </Section>

            <Section titulo="Canchas más usadas">

                {canchasOrdenadas.length === 0 ? (

                    <Vacio />

                ) : (

                    canchasOrdenadas.map((c) => (

                        <ItemRanking
                            key={c[0]}
                            nombre={c[0]}
                            valor={c[1]}
                        />

                    ))
                )}

            </Section>

        </div>
    );
}

// =========================
// CARD
// =========================

function Card({
    titulo,
    valor
}) {

    return (

        <div
            style={{
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "16px",
                padding: "16px"
            }}
        >

            <p
                style={{
                    margin: 0,
                    color: "#9e9e9e",
                    fontSize: "12px"
                }}
            >
                {titulo}
            </p>

            <h2
                style={{
                    marginTop: "10px",
                    marginBottom: 0,
                    fontSize: "28px"
                }}
            >
                {valor}
            </h2>

        </div>
    );
}

// =========================
// SECTION
// =========================

function Section({
    titulo,
    children
}) {

    return (

        <div
            style={{
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "16px",
                padding: "16px",
                marginBottom: "18px"
            }}
        >

            <h2
                style={{
                    marginTop: 0,
                    marginBottom: "18px",
                    fontSize: "18px"
                }}
            >
                {titulo}
            </h2>

            {children}

        </div>
    );
}

// =========================
// ITEM
// =========================

function ItemRanking({
    nombre,
    valor
}) {

    return (

        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid #2a2a2a"
            }}
        >

            <p
                style={{
                    margin: 0
                }}
            >
                {nombre}
            </p>

            <strong>
                {valor}
            </strong>

        </div>
    );
}

// =========================
// VACIO
// =========================

function Vacio() {

    return (

        <div
            style={{
                color: "#9e9e9e"
            }}
        >
            Sin datos
        </div>
    );
}