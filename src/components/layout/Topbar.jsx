import { Bell } from 'lucide-react'

export default function Topbar() {

    return (
        <header
            className="
                h-20
                border-b
                border-gray-800
                bg-[#111827]
                px-6
                flex
                items-center
                justify-between
            "
        >

            <div>

                <h2
                    className="
                        text-2xl
                        font-bold
                        text-white
                    "
                >
                    Bienvenido 👋
                </h2>

            </div>

            <button
                className="
                    relative
                    text-gray-400
                    hover:text-white
                "
            >

                <Bell size={24} />

                <span
                    className="
                        absolute
                        -top-1
                        -right-1
                        w-3
                        h-3
                        bg-red-500
                        rounded-full
                    "
                />

            </button>

        </header>
    )

}