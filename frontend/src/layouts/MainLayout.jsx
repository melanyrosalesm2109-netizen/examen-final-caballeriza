import { useEffect, useState } from 'react';
import {
    Outlet,
    useNavigate,
} from 'react-router';

import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import authService from '../services/authService';

function MainLayout() {
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(
        authService.getStoredUser(),
    );

    useEffect(() => {
        let active = true;

        const loadCurrentUser = async () => {
            try {
                const currentUser =
                    await authService.getMe();

                if (active) {
                    setUser(currentUser);
                }
            } catch {
                authService.logout();

                navigate('/login', {
                    replace: true,
                });
            }
        };

        loadCurrentUser();

        return () => {
            active = false;
        };
    }, [navigate]);

    return (
        <div className="app-shell">
            <Sidebar
                open={sidebarOpen}
                user={user}
                onToggle={() =>
                    setSidebarOpen(
                        (current) => !current,
                    )}
            />

            <div className="main-area">
                <Topbar user={user} />

                <main className="page-container">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;