export default function Card({
    children,
    className = ''
}) {
    return (
        <div
            className={`
                bg-[#131A2E]
                border border-gray-700
                rounded-2xl
                p-6
                shadow-lg
                ${className}
            `}
        >
            {children}
        </div>
    )
}