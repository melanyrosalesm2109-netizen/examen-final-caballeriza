import {
    Bell,
    CircleUserRound,
    LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router';

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

    const canSeeAlerts = [
        'ADMINISTRADOR',
        'CUIDADOR',
        'VETERINARIO',
    ].includes(user?.rol);

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
                <p>Administración y seguimiento general</p>
            </div>

            <div className="topbar-actions">
                {canSeeAlerts && (
                    <button
                        type="button"
                        className="icon-button"
                        onClick={() => navigate('/alertas')}
                        aria-label="Ver notificaciones"
                    >
                        <Bell size={21} />
                        <span className="notification-dot" />
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