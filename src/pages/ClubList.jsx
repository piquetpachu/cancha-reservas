import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ClubList() {

    const [clubs, setClubs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        async function cargarClubes() {

            const { data, error } = await supabase
                .from("clubs")
                .select("*");

            console.log("DATA:", data);
            console.log("ERROR:", error);

            if (error) {
                console.log("Error:", error);
                return;
            }

            setClubs(data || []);
        }

        cargarClubes();

    }, []);

    return (
        <div>

            <h2>Clubes</h2>

            {clubs.length === 0 ? (

                <p>No hay clubes</p>

            ) : (

                clubs.map((club) => (

                    <div
                        key={club.id}
                        onClick={() =>
                            navigate(`/club/${club.id}`)
                        }
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                            marginBottom: "20px",
                            overflow: "hidden",
                            cursor: "pointer",
                            maxWidth: "400px"
                        }}
                    >

                        {/* 📸 FOTO */}
                        {club.foto && (
                            <img
                                src={club.foto}
                                alt={club.nombre}
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover"
                                }}
                            />
                        )}

                        {/* 📄 INFO */}
                        <div style={{ padding: "10px" }}>

                            <strong
                                style={{
                                    fontSize: "20px"
                                }}
                            >
                                {club.nombre}
                            </strong>

                            <p>{club.direccion}</p>

                        </div>

                    </div>

                ))
            )}

        </div>
    );
}