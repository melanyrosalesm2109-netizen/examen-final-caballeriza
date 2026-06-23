import { Bell, CircleUserRound } from 'lucide-react';

function Topbar() {
    return (
        <header className="topbar">
            <div className="topbar-title">
                <h1>Sistema de Caballeriza</h1>
                <p>Administración y seguimiento general</p>
            </div>

            <div className="topbar-actions">
                <button
                    type="button"
                    className="icon-button"
                    aria-label="Ver notificaciones"
                >
                    <Bell size={21} />
                    <span className="notification-dot" />
                </button>

                <div className="user-summary">
                    <CircleUserRound size={34} />

                    <div>
                        <strong>Usuario</strong>
                        <span>Administrador</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Topbar;