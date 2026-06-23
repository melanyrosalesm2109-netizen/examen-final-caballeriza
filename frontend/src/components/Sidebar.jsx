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
        roles: [
            'ADMINISTRADOR',
            'CUIDADOR',
            'VETERINARIO',
        ],
    },
    {
        path: '/historial-medico',
        label: 'Historial médico',
        icon: HeartPulse,
        roles: [
            'ADMINISTRADOR',
            'VETERINARIO',
        ],
    },
    {
        path: '/alimentacion',
        label: 'Alimentación',
        icon: Utensils,
        roles: [
            'ADMINISTRADOR',
            'CUIDADOR',
            'VETERINARIO',
        ],
    },
    {
        path: '/suministros',
        label: 'Suministros',
        icon: PackageOpen,
        roles: [
            'ADMINISTRADOR',
            'CUIDADOR',
            'VETERINARIO',
        ],
    },
    {
        path: '/inventario',
        label: 'Inventario',
        icon: Boxes,
        roles: [
            'ADMINISTRADOR',
            'CUIDADOR',
            'VETERINARIO',
        ],
    },
    {
        path: '/alertas',
        label: 'Alertas',
        icon: Bell,
        roles: [
            'ADMINISTRADOR',
            'CUIDADOR',
            'VETERINARIO',
        ],
    },
    {
        path: '/usuarios',
        label: 'Usuarios y roles',
        icon: Users,
        roles: ['ADMINISTRADOR'],
    },
    {
        path: '/empleados',
        label: 'Empleados',
        icon: UserCog,
        roles: ['ADMINISTRADOR'],
    },
    {
        path: '/turnos',
        label: 'Turnos',
        icon: Clock3,
        roles: [
            'ADMINISTRADOR',
            'CUIDADOR',
        ],
    },
    {
        path: '/tareas',
        label: 'Tareas',
        icon: ClipboardCheck,
        roles: [
            'ADMINISTRADOR',
            'CUIDADOR',
        ],
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

function Sidebar({
                     open,
                     onToggle,
                     user,
                 }) {
    const visibleItems = menuItems.filter(
        (item) => {
            if (!item.roles) {
                return true;
            }

            return item.roles.includes(user?.rol);
        },
    );

    return (
        <>
            <button
                className="mobile-menu-button"
                type="button"
                onClick={onToggle}
                aria-label={
                    open
                        ? 'Cerrar menú'
                        : 'Abrir menú'
                }
            >
                {open ? (
                    <X size={22} />
                ) : (
                    <Menu size={22} />
                )}
            </button>

            {open && (
                <button
                    type="button"
                    className="sidebar-overlay"
                    onClick={onToggle}
                    aria-label="Cerrar menú"
                />
            )}

            <aside
                className={
                    `sidebar ${
                        open ? 'sidebar-open' : ''
                    }`
                }
            >
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
                    {visibleItems.map(
                        ({
                             path,
                             label,
                             icon: Icon,
                         }) => (
                            <NavLink
                                key={path}
                                to={path}
                                end={path === '/'}
                                className={({
                                                isActive,
                                            }) =>
                                    `sidebar-link ${
                                        isActive
                                            ? 'sidebar-link-active'
                                            : ''
                                    }`
                                }
                                onClick={() => {
                                    if (
                                        window.innerWidth
                                        <= 900
                                    ) {
                                        onToggle();
                                    }
                                }}
                            >
                                <Icon size={20} />
                                <span>{label}</span>
                            </NavLink>
                        ),
                    )}
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