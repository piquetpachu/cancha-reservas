import BracketMatch from './BracketMatch'

export default function BracketRound({
    ronda,
    partidos
}) {
    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-center">
                Ronda {ronda}
            </h2>

            {
                partidos.map((partido) => (
                    <BracketMatch
                        key={partido.id}
                        partido={partido}
                    />
                ))
            }
        </div>
    )
}