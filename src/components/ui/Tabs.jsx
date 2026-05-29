export default function Tabs({
    tabs,
    activeTab,
    setActiveTab
}) {

    return (
        <div
            className="
                w-full
                overflow-x-auto
                scrollbar-hide
            "
        >

            <div
                className="
                    flex
                    gap-3
                    min-w-max
                    pb-2
                "
            >

                {
                    tabs.map((tab) => {

                        const active =
                            activeTab === tab.id

                        return (

                            <button
                                key={tab.id}
                                onClick={() =>
                                    setActiveTab(
                                        tab.id
                                    )
                                }
                                className={`
                                    px-5
                                    py-3
                                    rounded-2xl
                                    font-semibold
                                    transition
                                    whitespace-nowrap
                                    border

                                    ${
                                        active
                                            ? `
                                                bg-blue-600
                                                border-blue-500
                                                text-white
                                                shadow-lg
                                                shadow-blue-500/20
                                              `
                                            : `
                                                bg-[#111827]
                                                border-gray-800
                                                text-gray-400
                                                hover:bg-[#1F2937]
                                                hover:text-white
                                              `
                                    }
                                `}
                            >

                                {tab.label}

                            </button>

                        )

                    })
                }

            </div>

        </div>
    )

}