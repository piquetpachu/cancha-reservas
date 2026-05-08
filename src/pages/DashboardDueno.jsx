import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function DashboardDueno() {

    const [clubs, setClubs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        async function cargarClubes() {

            // usuario logueado
            const { data: userData } =
                await supabase.auth.getUser();

            const user = userData.user;

            if (!user) return;

            // SOLO CLUBES DEL DUEÑO
            const { data, error } =
                await supabase
                    .from("clubs")
                    .select("*")
                    .eq("owner_id", user.id);

            console.log(data);
            console.log(error);

            if (!error) {
                setClubs(data || []);
            }
        }

        cargarClubes();

    }, []);

    return (

        <div style={{ padding: "20px" }}>

            <Navbar />

            <h1>🏟️ Mis Clubes</h1>

            {clubs.length === 0 ? (

                <p>No tenés clubes</p>

            ) : (

                clubs.map((club) => (

                    <div
                        key={club.id}
                        onClick={() =>
                            navigate(`/club-dueno/${club.id}`)
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