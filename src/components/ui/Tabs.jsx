export default function Tabs({
    tabs,
    activeTab,
    setActiveTab
}) {
    return (
        <div className="
            flex
            gap-3
            overflow-x-auto
            pb-2
        ">
            {
                tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() =>
                            setActiveTab(tab.id)
                        }
                        className={`
                            px-5 py-3 rounded-xl
                            whitespace-nowrap
                            transition
                            font-medium
                            border
                            
                            ${
                                activeTab === tab.id
                                    ? `
                                        bg-blue-600
                                        border-blue-600
                                        text-white
                                    `
                                    : `
                                        bg-[#131A2E]
                                        border-gray-700
                                        text-gray-300
                                        hover:bg-[#1B2540]
                                    `
                            }
                        `}
                    >
                        {tab.label}
                    </button>
                ))
            }
        </div>
    )
}