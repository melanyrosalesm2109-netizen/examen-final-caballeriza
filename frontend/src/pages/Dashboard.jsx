import {
    Bell,
    Boxes,
    HeartPulse,
    PawPrint,
} from 'lucide-react';

import PageHeader from '../components/PageHeader';

const stats = [
    {
        label: 'Caballos registrados',
        value: 0,
        description: 'Gestión de caballos',
        icon: PawPrint,
    },
    {
        label: 'Registros médicos',
        value: 0,
        description: 'Historial clínico',
        icon: HeartPulse,
    },
    {
        label: 'Insumos disponibles',
        value: 0,
        description: 'Control de inventario',
        icon: Boxes,
    },
    {
        label: 'Alertas pendientes',
        value: 0,
        description: 'Notificaciones no leídas',
        icon: Bell,
    },
];

function Dashboard() {
    return (
        <>
            <PageHeader
                title="Panel principal"
                description="Resumen general de la administración de la caballeriza."
            />

            <section className="stats-grid">
                {stats.map(({ label, value, description, icon: Icon }) => (
                    <article className="stat-card" key={label}>
                        <div className="stat-card-icon">
                            <Icon size={24} />
                        </div>

                        <div>
                            <span>{label}</span>
                            <strong>{value}</strong>
                            <small>{description}</small>
                        </div>
                    </article>
                ))}
            </section>

            <section className="dashboard-grid">
                <article className="content-card">
                    <h3>Actividad reciente</h3>
                    <p>
                        Aquí se mostrarán los últimos registros médicos,
                        movimientos de inventario y suministros realizados.
                    </p>

                    <div className="empty-state">
                        Todavía no hay actividad para mostrar.
                    </div>
                </article>

                <article className="content-card">
                    <h3>Alertas importantes</h3>
                    <p>
                        Consulta vacunas, tratamientos e insumos con existencias
                        bajas.
                    </p>

                    <div className="empty-state">
                        No hay alertas pendientes.
                    </div>
                </article>
            </section>
        </>
    );
}

export default Dashboard;