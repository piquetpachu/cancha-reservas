import { Outlet } from 'react-router-dom'

import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'

export default function DashboardLayout() {

    return (
        <div
            className="
                min-h-screen
                bg-[#0B1020]
                flex
            "
        >

            <Sidebar />

            <div className="flex-1 flex flex-col">

                <Topbar />

<hr />
                <main className="p-6">

                    <Outlet />

                </main>

            </div>
        </div>
    )

}