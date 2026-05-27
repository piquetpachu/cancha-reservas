export default function Section({
    title,
    subtitle,
    children
}) {
    return (
        <div className="space-y-6">

            <div>
                <h2 className="text-3xl font-bold">
                    {title}
                </h2>

                {
                    subtitle && (
                        <p className="
                            text-gray-400
                            mt-2
                        ">
                            {subtitle}
                        </p>
                    )
                }
            </div>

            {children}

        </div>
    )
}