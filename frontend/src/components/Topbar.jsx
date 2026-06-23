import {
    Bell,
    CircleUserRound,
    LogOut,
} from 'lucide-react';
import {
    useEffect,
    useState,
} from 'react';
import { useNavigate } from 'react-router';

import alertService, {
    ALERTS_UPDATED_EVENT,
} from '../services/alertService';
import authService from '../services/authService';

function formatRole(role) {
    if (!role) {
        return 'Usuario';
    }

    return role
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(
            /\b\w/g,
            (letter) => letter.toUpperCase(),
        );
}

function Topbar({ user }) {
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] =
        useState(0);

    const canSeeAlerts = [
        'ADMINISTRADOR',
        'CUIDADOR',
        'VETERINARIO',
    ].includes(user?.rol);

    const loadUnreadCount = async () => {
        if (!canSeeAlerts) {
            setUnreadCount(0);
            return;
        }

        try {
            const data =
                await alertService.getUnread();

            setUnreadCount(
                Array.isArray(data)
                    ? data.length
                    : 0,
            );
        } catch {
            setUnreadCount(0);
        }
    };

    useEffect(() => {
        loadUnreadCount();

        window.addEventListener(
            ALERTS_UPDATED_EVENT,
            loadUnreadCount,
        );

        return () => {
            window.removeEventListener(
                ALERTS_UPDATED_EVENT,
                loadUnreadCount,
            );
        };
    }, [user?.rol]);

    const handleLogout = () => {
        authService.logout();

        navigate('/login', {
            replace: true,
        });
    };

    return (
        <header className="topbar">
            <div className="topbar-title">
                <h1>Sistema de Caballeriza</h1>
                <p>
                    Administración y seguimiento general
                </p>
            </div>

            <div className="topbar-actions">
                {canSeeAlerts && (
                    <button
                        type="button"
                        className="icon-button"
                        onClick={() =>
                            navigate('/alertas')}
                        aria-label="Ver notificaciones"
                    >
                        <Bell size={21} />

                        {unreadCount > 0 && (
                            <span className="notification-count">
                                {unreadCount > 99
                                    ? '99+'
                                    : unreadCount}
                            </span>
                        )}
                    </button>
                )}

                <div className="user-summary">
                    <CircleUserRound size={34} />

                    <div>
                        <strong>
                            {user?.nombre || 'Usuario'}
                        </strong>

                        <span>
                            {formatRole(user?.rol)}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </header>
    );
}

export default Topbar;