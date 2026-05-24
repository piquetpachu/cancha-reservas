import { Link } from 'react-router-dom'

export default function TournamentCard({
    torneo
}) {
    return (
        <div className="border rounded p-4 shadow">
            <img
                src={
                    torneo.imagen_url ||
                    'https://placehold.co/600x400'
                }
                alt={torneo.nombre}
                className="w-full h-48 object-cover rounded"
            />

            <h2 className="text-xl font-bold mt-4">
                {torneo.nombre}
            </h2>

            <p className="mt-2">
                {torneo.descripcion}
            </p>

            <p className="mt-2">
                Cupo: {torneo.cupo_maximo}
            </p>

            <Link
                to={`/torneos/${torneo.id}`}
                className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Ver torneo
            </Link>
        </div>
    )
}