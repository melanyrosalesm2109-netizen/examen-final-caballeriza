import {
    Bell,
    Boxes,
    CalendarCheck,
    CalendarDays,
    ClipboardCheck,
    Clock3,
    HeartPulse,
    LayoutDashboard,
    Menu,
    PackageOpen,
    PawPrint,
    UserCog,
    Users,
    Utensils,
    X,
} from 'lucide-react';

import { NavLink } from 'react-router';

const menuItems = [
    {
        path: '/',
        label: 'Inicio',
        icon: LayoutDashboard,
    },
    {
        path: '/caballos',
        label: 'Caballos',
        icon: PawPrint,
    },
    {
        path: '/historial-medico',
        label: 'Historial médico',
        icon: HeartPulse,
    },
    {
        path: '/alimentacion',
        label: 'Alimentación',
        icon: Utensils,
    },
    {
        path: '/suministros',
        label: 'Suministros',
        icon: PackageOpen,
    },
    {
        path: '/inventario',
        label: 'Inventario',
        icon: Boxes,
    },
    {
        path: '/alertas',
        label: 'Alertas',
        icon: Bell,
    },

    // Módulos de Josué
    {
        path: '/usuarios',
        label: 'Usuarios y roles',
        icon: Users,
    },
    {
        path: '/empleados',
        label: 'Empleados',
        icon: UserCog,
    },
    {
        path: '/turnos',
        label: 'Turnos',
        icon: Clock3,
    },
    {
        path: '/tareas',
        label: 'Tareas',
        icon: ClipboardCheck,
    },
    {
        path: '/reservas',
        label: 'Reservas',
        icon: CalendarCheck,
    },
    {
        path: '/calendario',
        label: 'Calendario',
        icon: CalendarDays,
    },
];

function Sidebar({ open, onToggle }) {
    return (
        <>
            <button
                className="mobile-menu-button"
                type="button"
                onClick={onToggle}
                aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            >
                {open ? <X size={22} /> : <Menu size={22} />}
            </button>

            {open && (
                <button
                    type="button"
                    className="sidebar-overlay"
                    onClick={onToggle}
                    aria-label="Cerrar menú"
                />
            )}

            <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <PawPrint size={25} />
                    </div>

                    <div>
                        <strong>Caballeriza</strong>
                        <span>Panel de gestión</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map(({ path, label, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={path === '/'}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                            }
                            onClick={() => {
                                if (window.innerWidth <= 900) {
                                    onToggle();
                                }
                            }}
                        >
                            <Icon size={20} />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                <footer className="sidebar-footer">
                    <span>Examen Final</span>
                    <small>Melany y Josué</small>
                </footer>
            </aside>
        </>
    );
}

export default Sidebar;