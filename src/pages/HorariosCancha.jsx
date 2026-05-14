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

   
    // CARGA SEGURA
   
    useEffect(() => {

        if (!id) return;

        const cargar = async () => {

            const { data, error } = await supabase
                .from("horarios_cancha")
                .select("*")
                .eq("cancha_id", id)
                .order("dia_semana")
                .order("hora_inicio");

            if (!error) {
                setHorarios(data || []);
            }
        };

        cargar();

    }, [id]);

    
    // DÍAS
    
    function toggleDia(dia) {

        setDiasSeleccionados(prev =>
            prev.includes(dia)
                ? prev.filter(d => d !== dia)
                : [...prev, dia]
        );
    }

    function seleccionarTodos() {
        setDiasSeleccionados(dias);
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

    
    // GUARDAR
    
    async function guardarHorario() {

        if (
            !diasSeleccionados.length ||
            !horaInicio ||
            !horaFin
        ) {
            setMensaje("Completá todos los campos");
            return;
        }

        
        // VALIDAR HORAS
        
        if (horaInicio >= horaFin) {
            setMensaje(
                "La hora final debe ser mayor"
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
                horaInicio < h.hora_fin &&
                horaFin > h.hora_inicio
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
            hora_inicio: horaInicio,
            hora_fin: horaFin
        }));

       
        // INSERTAR
       
        const { error } = await supabase
            .from("horarios_cancha")
            .insert(datos);

        if (error) {
            setMensaje("Error: " + error.message);
            return;
        }

        setMensaje("Horarios agregados ✅");

        setDiasSeleccionados([]);
        setHoraInicio("");
        setHoraFin("");

       
        // RECARGAR
      
        const { data } = await supabase
            .from("horarios_cancha")
            .select("*")
            .eq("cancha_id", id)
            .order("dia_semana")
            .order("hora_inicio");

        setHorarios(data || []);
    }

    
    // ELIMINAR
   
    async function eliminarHorario(horarioId) {

        const { error } = await supabase
            .from("horarios_cancha")
            .delete()
            .eq("id", horarioId);

        if (!error) {

            setHorarios(prev =>
                prev.filter(h => h.id !== horarioId)
            );
        }
    }

    
    // UI

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

            {/* botones rápidos */}
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

            {/* días */}
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

            {/* horas */}
            <div style={{ marginTop: "10px" }}>

                <input
                    type="time"
                    value={horaInicio}
                    onChange={(e) =>
                        setHoraInicio(e.target.value)
                    }
                />

                <input
                    type="time"
                    value={horaFin}
                    onChange={(e) =>
                        setHoraFin(e.target.value)
                    }
                />

            </div>

            <button
                onClick={guardarHorario}
                style={{ marginTop: "10px" }}
            >
                Guardar horarios
            </button>

            <p>{mensaje}</p>

            {/* lista */}
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
                            onClick={() => {
                                console.log("Eliminar:", h);
                                eliminarHorario(h.id);
                            }}
                        >
                            X
                        </button>

                    </div>
                ))
            )}

        </div>
    );
}