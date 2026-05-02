import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function ClubDetalle() {
    const { id } = useParams(); // ID del club (UUID)
    const [canchas, setCanchas] = useState([]);

    useEffect(() => {
        async function cargarCanchas() {
            const { data, error } = await supabase
                .from("canchas")
                .select("*")
                .eq("club_id", id)

            console.log("ID:", id);
            console.log("Canchas:", data);
            console.log("Error:", error);

            if (!error) {
                setCanchas(data || []);
            }
        }

        cargarCanchas();
    }, [id]);

    return (
        <div>
            <h2>Canchas del club</h2>

            {canchas.length === 0 ? (
                <p>No hay canchas</p>
            ) : (
                canchas.map((cancha) => (
                    <div key={cancha.id}>
                        <p>{cancha.nombre}</p>
                    </div>
                ))
            )}
        </div>
    );
}