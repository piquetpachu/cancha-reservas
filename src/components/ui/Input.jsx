export default function Input({
    className = '',
    ...props
}) {
    return (
        <input
            className={`
                w-full
                bg-[#0B1020]
                border border-gray-700
                rounded-xl
                px-4 py-3
                text-white
                outline-none
                focus:border-blue-500
                ${className}
            `}
            {...props}
        />
    )
}