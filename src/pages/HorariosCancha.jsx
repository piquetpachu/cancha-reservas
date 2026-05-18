import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

export default function HorariosCancha() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [diasSeleccionados, setDiasSeleccionados] = useState([]);
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [horarios, setHorarios] = useState([]);
    const [mensaje, setMensaje] = useState("");

    const dias = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo"
    ];

    // CARGAR HORARIOS

    async function cargarHorarios() {

        const { data, error } = await supabase
            .from("horarios_cancha")
            .select("*")
            .eq("cancha_id", id)
            .order("dia_semana", { ascending: true })
            .order("hora_inicio", { ascending: true });

        if (error) {
            console.log(error);
            return;
        }

        setHorarios(data || []);
    }

    useEffect(() => {

        if (!id) return;

        cargarHorarios();

    }, [id]);

    // TOGGLE DÍA

    function toggleDia(dia) {

        setDiasSeleccionados(prev => {

            if (prev.includes(dia)) {
                return prev.filter(d => d !== dia);
            }
            return [...prev, dia];
        });
    }

    // SELECCIONES RÁPIDAS
    

    function seleccionarTodos() {

        setDiasSeleccionados([
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado",
            "domingo"
        ]);
    }

    function seleccionarSemana() {

        setDiasSeleccionados([
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes"
        ]);
    }

    function seleccionarFinde() {

        setDiasSeleccionados([
            "sabado",
            "domingo"
        ]);
    }

   
    // NORMALIZAR HORAS
    

    function normalizarHora(hora) {

        return hora.slice(0, 2) + ":00";
    }

   
    // GUARDAR HORARIO
   

    async function guardarHorario() {

        setMensaje("");

        if (
            !diasSeleccionados.length ||
            !horaInicio ||
            !horaFin
        ) {
            setMensaje("Completá todos los campos");
            return;
        }

        const inicio = normalizarHora(horaInicio);
        const fin = normalizarHora(horaFin);

        // VALIDAR HORAS

        if (inicio >= fin) {

            setMensaje(
                "La hora final debe ser mayor"
            );

            return;
        }

        // VALIDAR DUPLICADOS

        const existeDuplicado = horarios.some(h => {

            return (
                diasSeleccionados.includes(h.dia_semana) &&
                h.hora_inicio.slice(0, 5) === inicio &&
                h.hora_fin.slice(0, 5) === fin
            );
        });

        if (existeDuplicado) {

            setMensaje(
                "Ese horario ya existe"
            );

            return;
        }

        // VALIDAR SUPERPOSICIÓN

        const existeSolapamiento = horarios.some(h => {

            const mismoDia =
                diasSeleccionados.includes(
                    h.dia_semana
                );

            if (!mismoDia) {
                return false;
            }

            return (
                inicio < h.hora_fin &&
                fin > h.hora_inicio
            );
        });

        if (existeSolapamiento) {

            setMensaje(
                "Ya existe un horario que se superpone"
            );

            return;
        }

        // CREAR DATOS

        const datos = diasSeleccionados.map(dia => ({
            cancha_id: id,
            dia_semana: dia,
            hora_inicio: inicio,
            hora_fin: fin
        }));

        // INSERTAR

        const { error } = await supabase
            .from("horarios_cancha")
            .insert(datos);

        if (error) {

            console.log(error);

            setMensaje(
                "Error: " + error.message
            );

            return;
        }

        // LIMPIAR

        setDiasSeleccionados([]);
        setHoraInicio("");
        setHoraFin("");

        setMensaje(
            "Horarios agregados ✅"
        );

        // RECARGAR

        await cargarHorarios();
    }

   
    // ELIMINAR HORARIO
   

    async function eliminarHorario(horarioId) {

        const { error } = await supabase
            .from("horarios_cancha")
            .delete()
            .match({
                id: horarioId
            });

        if (error) {

            console.log(error);

            setMensaje(
                "Error eliminando horario"
            );

            return;
        }

        await cargarHorarios();
    }

   


    return (

        <div
            style={{
                padding: "20px",
                maxWidth: "600px",
                margin: "0 auto"
            }}
        >

            <button onClick={() => navigate(-1)}>
                ← Volver
            </button>

            <h2>Horarios de la cancha</h2>

            {/* BOTONES RÁPIDOS */}
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap"
                }}
            >

                <button onClick={seleccionarTodos}>
                    Todos
                </button>

                <button onClick={seleccionarSemana}>
                    Lun-Vie
                </button>

                <button onClick={seleccionarFinde}>
                    Finde
                </button>

            </div>

            {/* DÍAS */}
            <div style={{ marginTop: "10px" }}>

                {dias.map(dia => (

                    <label
                        key={dia}
                        style={{ marginRight: "10px" }}
                    >

                        <input
                            type="checkbox"
                            checked={
                                diasSeleccionados.includes(dia)
                            }
                            onChange={() => toggleDia(dia)}
                        />

                        {dia}

                    </label>
                ))}

            </div>

            {/* HORAS */}
            <div
                style={{
                    marginTop: "10px",
                    display: "flex",
                    gap: "10px"
                }}
            >

                <select
                    value={horaInicio}
                    onChange={(e) =>
                        setHoraInicio(e.target.value)
                    }
                    style={{
                        padding: "8px"
                    }}
                >

                    <option value="">
                        Hora inicio
                    </option>

                    {Array.from({ length: 24 }).map((_, i) => {

                        const hora =
                            String(i).padStart(2, "0") + ":00";

                        return (
                            <option
                                key={hora}
                                value={hora}
                            >
                                {hora}
                            </option>
                        );
                    })}

                </select>

                <select
                    value={horaFin}
                    onChange={(e) =>
                        setHoraFin(e.target.value)
                    }
                    style={{
                        padding: "8px"
                    }}
                >

                    <option value="">
                        Hora de cierre
                    </option>

                    {Array.from({ length: 24 }).map((_, i) => {

                        const hora =
                            String(i).padStart(2, "0") + ":00";

                        return (
                            <option
                                key={hora}
                                value={hora}
                            >
                                {hora}
                            </option>
                        );
                    })}

                </select>

            </div>

            <button
                onClick={guardarHorario}
                style={{ marginTop: "10px" }}
            >
                Guardar horarios
            </button>

            <p>{mensaje}</p>

            {/* LISTA */}
            <h3>Horarios cargados</h3>

            {horarios.length === 0 ? (

                <p>No hay horarios</p>

            ) : (

                horarios.map(h => (

                    <div
                        key={h.id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                            border: "1px solid #ccc",
                            padding: "10px",
                            borderRadius: "8px"
                        }}
                    >

                        <span>

                            {h.dia_semana}{" "}

                            {h.hora_inicio.slice(0, 5)}

                            {" - "}

                            {h.hora_fin.slice(0, 5)}

                        </span>

                        <button
                            onClick={() =>
                                eliminarHorario(h.id)
                            }
                        >
                            X
                        </button>

                    </div>
                ))
            )}

        </div>
    );
}