import { useState } from 'react';
import { Outlet } from 'react-router';

import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-shell">
            <Sidebar
                open={sidebarOpen}
                onToggle={() => setSidebarOpen((current) => !current)}
            />

            <div className="main-area">
                <Topbar />

                <main className="page-container">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;