export default function Button({
    children,
    variant = 'primary',
    className = '',
    ...props
}) {
    const variants = {
        primary: `
            bg-blue-600
            hover:bg-blue-700
            text-white
        `,

        danger: `
            bg-red-500
            hover:bg-red-600
            text-white
        `,

        success: `
            bg-green-500
            hover:bg-green-600
            text-white
        `,

        warning: `
            bg-yellow-500
            hover:bg-yellow-600
            text-white
        `,

        secondary: `
            bg-[#1B2540]
            hover:bg-[#24304F]
            text-white
            border border-gray-700
        `
    }

    return (
        <button
            className={`
                px-5 py-3
                rounded-xl
                transition
                font-medium
                disabled:opacity-50
                disabled:cursor-not-allowed
                ${variants[variant]}
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    )
}