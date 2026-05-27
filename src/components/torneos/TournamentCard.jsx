import { Link } from 'react-router-dom'

export default function TournamentCard({
    torneo
}) {
    return (
        <Link
            to={`/torneos/${torneo.id}`}
            className="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition block"
        >
            <div className="overflow-hidden">
                <img
                    src={
                        torneo.imagen_url ||
                        'https://placehold.co/600x400'
                    }
                    alt={torneo.nombre}
                    className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
                />
            </div>

            <div className="p-5">

                <div className="flex items-start justify-between gap-3">
                    <h2 className="text-2xl font-bold">
                        {torneo.nombre}
                    </h2>

                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                        Activo
                    </span>
                </div>

                <p className="text-gray-600 mt-3 line-clamp-2">
                    {torneo.descripcion}
                </p>

                <div className="mt-5 flex items-center justify-between">

                    <div>
                        <p className="text-sm text-gray-500">
                            Cupos
                        </p>

                        <p className="font-bold">
                            {torneo.cupo_maximo}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Inicio
                        </p>

                        <p className="font-bold">
                            {torneo.fecha_inicio}
                        </p>
                    </div>

                </div>

            </div>
        </Link>
    )
}