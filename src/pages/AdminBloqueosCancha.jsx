import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminBloqueos() {

    const [bloqueos, setBloqueos] = useState([]);
    const [canchas, setCanchas] = useState([]);
    const [clubs, setClubs] = useState([]);

    const [loading, setLoading] = useState(true);

    // filtros

    const [busqueda, setBusqueda] = useState("");
    const [fechaFiltro, setFechaFiltro] = useState("");

    // crear bloqueo

    const [clubId, setClubId] = useState("");
    const [canchaId, setCanchaId] = useState("");
    const [fecha, setFecha] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [motivo, setMotivo] = useState("");

    useEffect(() => {

        cargarDatos();

    }, []);

    async function cargarDatos() {

        setLoading(true);

        // BLOQUEOS

        const {
            data: bloqueosData,
            error: bloqueosError
        } = await supabase
            .from("bloqueos_horarios")
            .select(`
                *,
                canchas (
                    id,
                    nombre,
                    club_id,
                    clubs (
                        nombre
                    )
                )
            `)
            .order("fecha", {
                ascending: false
            });

        if (bloqueosError) {

            console.log(bloqueosError);

        } else {

            setBloqueos(bloqueosData || []);
        }

        // CLUBS

        const {
            data: clubsData,
            error: clubsError
        } = await supabase
            .from("clubs")
            .select("*")
            .neq("habilitacion", "eliminado")
            .order("nombre");

        if (clubsError) {

            console.log(clubsError);

        } else {

            setClubs(clubsData || []);
        }

        // CANCHAS

        const {
            data: canchasData,
            error: canchasError
        } = await supabase
            .from("canchas")
            .select(`
                *,
                clubs (
                    nombre
                )
            `)
            .neq("habilitacion", "eliminado")
            .order("nombre");

        if (canchasError) {

            console.log(canchasError);

        } else {

            setCanchas(canchasData || []);
        }

        setLoading(false);
    }

    async function crearBloqueo(e) {

        e.preventDefault();

        if (
            !clubId ||
            !canchaId ||
            !fecha ||
            !horaInicio ||
            !horaFin
        ) {

            alert("Completa todos los campos");
            return;
        }

        const {
            error
        } = await supabase
            .from("bloqueos_horarios")
            .insert([
                {
                    cancha_id: canchaId,
                    fecha,
                    hora_inicio: horaInicio,
                    hora_fin: horaFin,
                    motivo
                }
            ]);

        if (error) {

            console.log(error);
            alert("Error al crear bloqueo");
            return;
        }

        setClubId("");
        setCanchaId("");
        setFecha("");
        setHoraInicio("");
        setHoraFin("");
        setMotivo("");

        await cargarDatos();

        alert("Bloqueo creado");
    }

    async function eliminarBloqueo(id) {

        const confirmar = window.confirm(
            "¿Eliminar bloqueo?"
        );

        if (!confirmar) return;

        const {
            error
        } = await supabase
            .from("bloqueos_horarios")
            .delete()
            .eq("id", id);

        if (error) {

            console.log(error);
            return;
        }

        await cargarDatos();
    }

    // FILTRO DE CANCHAS POR CLUB

    const canchasFiltradasPorClub = canchas.filter((c) => {

        return c.club_id === clubId;
    });

    // FILTROS BLOQUEOS

    const bloqueosFiltrados = bloqueos.filter((b) => {

        const coincideCancha =
            b.canchas?.nombre
                ?.toLowerCase()
                .includes(
                    busqueda.toLowerCase()
                );

        const coincideFecha =
            fechaFiltro === ""
                ? true
                : b.fecha === fechaFiltro;

        return coincideCancha && coincideFecha;
    });

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
                Cargando bloqueos...
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

            <h1
                style={{
                    marginTop: 0
                }}
            >
                Bloqueos
            </h1>

            {/* CREAR */}

            <form
                onSubmit={crearBloqueo}
                style={{
                    background: "#1a1a1a",
                    borderRadius: "16px",
                    padding: "16px",
                    marginBottom: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }}
            >

                {/* CLUB */}

                <select
                    value={clubId}
                    onChange={(e) => {

                        setClubId(e.target.value);
                        setCanchaId("");

                    }}
                    style={inputStyle}
                >

                    <option value="">
                        Seleccionar club
                    </option>

                    {clubs.map((club) => (

                        <option
                            key={club.id}
                            value={club.id}
                        >
                            {club.nombre}
                        </option>

                    ))}

                </select>

                {/* CANCHA */}

                <select
                    value={canchaId}
                    onChange={(e) =>
                        setCanchaId(e.target.value)
                    }
                    style={inputStyle}
                    disabled={!clubId}
                >

                    <option value="">
                        Seleccionar cancha
                    </option>

                    {canchasFiltradasPorClub.map((c) => (

                        <option
                            key={c.id}
                            value={c.id}
                        >
                            {c.nombre}
                        </option>

                    ))}

                </select>

                {/* FECHA */}

                <input
                    type="date"
                    value={fecha}
                    onChange={(e) =>
                        setFecha(e.target.value)
                    }
                    style={inputStyle}
                />

                {/* HORA INICIO */}

                <input
                    type="time"
                    value={horaInicio}
                    onChange={(e) =>
                        setHoraInicio(e.target.value)
                    }
                    style={inputStyle}
                />

                {/* HORA FIN */}

                <input
                    type="time"
                    value={horaFin}
                    onChange={(e) =>
                        setHoraFin(e.target.value)
                    }
                    style={inputStyle}
                />

                {/* MOTIVO */}

                <textarea
                    placeholder="Motivo"
                    value={motivo}
                    onChange={(e) =>
                        setMotivo(e.target.value)
                    }
                    rows={3}
                    style={{
                        ...inputStyle,
                        resize: "none"
                    }}
                />

                {/* BOTON */}

                <button
                    type="submit"
                    style={{
                        background: "#ef6c00",
                        border: "none",
                        color: "white",
                        borderRadius: "12px",
                        padding: "14px",
                        fontWeight: "700",
                        cursor: "pointer"
                    }}
                >
                    Crear bloqueo
                </button>

            </form>

            {/* FILTROS */}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginBottom: "20px"
                }}
            >

                <input
                    type="text"
                    placeholder="Buscar cancha..."
                    value={busqueda}
                    onChange={(e) =>
                        setBusqueda(e.target.value)
                    }
                    style={inputStyle}
                />

                <input
                    type="date"
                    value={fechaFiltro}
                    onChange={(e) =>
                        setFechaFiltro(e.target.value)
                    }
                    style={inputStyle}
                />

            </div>

            {/* LISTA */}

            {bloqueosFiltrados.length === 0 ? (

                <div
                    style={{
                        background: "#1a1a1a",
                        borderRadius: "14px",
                        padding: "16px",
                        color: "#9e9e9e"
                    }}
                >
                    No hay bloqueos
                </div>

            ) : (

                bloqueosFiltrados.map((b) => (

                    <div
                        key={b.id}
                        style={{
                            background: "#1a1a1a",
                            border: "1px solid #2a2a2a",
                            borderRadius: "16px",
                            padding: "14px",
                            marginBottom: "12px"
                        }}
                    >

                        <h3
                            style={{
                                marginTop: 0,
                                marginBottom: "6px"
                            }}
                        >
                            {b.canchas?.nombre}
                        </h3>

                        <p
                            style={{
                                color: "#9e9e9e",
                                marginTop: 0
                            }}
                        >
                            {b.canchas?.clubs?.nombre}
                        </p>

                        <p>
                            {b.fecha}
                        </p>

                        <p>
                            {b.hora_inicio} - {b.hora_fin}
                        </p>

                        <p
                            style={{
                                color: "#bdbdbd"
                            }}
                        >
                            {b.motivo || "Sin motivo"}
                        </p>

                        <button
                            onClick={() =>
                                eliminarBloqueo(b.id)
                            }
                            style={{
                                background: "#b71c1c",
                                border: "none",
                                color: "white",
                                borderRadius: "10px",
                                padding: "10px 14px",
                                fontWeight: "700",
                                cursor: "pointer"
                            }}
                        >
                            Eliminar
                        </button>

                    </div>

                ))
            )}

        </div>
    );
}

const inputStyle = {
    width: "100%",
    background: "#202020",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "13px",
    color: "white",
    boxSizing: "border-box",
    fontSize: "14px"
};