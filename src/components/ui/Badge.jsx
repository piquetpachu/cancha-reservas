export default function Badge({
    children,
    variant = 'default'
}) {
    const variants = {
        default: `
            bg-gray-700
            text-white
        `,

        success: `
            bg-green-500/20
            text-green-400
        `,

        warning: `
            bg-yellow-500/20
            text-yellow-400
        `,

        danger: `
            bg-red-500/20
            text-red-400
        `
    }

    return (
        <span
            className={`
                px-3 py-1
                rounded-full
                text-sm
                font-medium
                ${variants[variant]}
            `}
        >
            {children}
        </span>
    )
}