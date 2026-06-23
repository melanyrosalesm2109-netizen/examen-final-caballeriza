import {
    AlertTriangle,
    Bell,
    Boxes,
    HeartPulse,
    PawPrint,
} from 'lucide-react';
import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import PageHeader from '../components/PageHeader';
import alertService from '../services/alertService';
import authService from '../services/authService';
import horseService from '../services/horseService';
import inventoryService from '../services/inventoryService';
import medicalHistoryService from '../services/medicalHistoryService';

function formatDate(dateValue) {
    if (!dateValue) {
        return 'Sin fecha';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return new Intl.DateTimeFormat('es-CR', {
        dateStyle: 'medium',
    }).format(date);
}

function Dashboard() {
    const currentUser = authService.getStoredUser();

    const canSeeMedicalHistory = [
        'ADMINISTRADOR',
        'VETERINARIO',
    ].includes(currentUser?.rol);

    const canSeeInventory = [
        'ADMINISTRADOR',
        'CUIDADOR',
        'VETERINARIO',
    ].includes(currentUser?.rol);

    const canSeeAlerts = [
        'ADMINISTRADOR',
        'CUIDADOR',
        'VETERINARIO',
    ].includes(currentUser?.rol);

    const [horses, setHorses] = useState([]);
    const [medicalRecords, setMedicalRecords] =
        useState([]);
    const [inventoryItems, setInventoryItems] =
        useState([]);
    const [alerts, setAlerts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [warning, setWarning] = useState('');

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setWarning('');

            const results = await Promise.allSettled([
                horseService.getAll(),

                canSeeMedicalHistory
                    ? medicalHistoryService.getAll()
                    : Promise.resolve([]),

                canSeeInventory
                    ? inventoryService.getAll()
                    : Promise.resolve([]),

                canSeeAlerts
                    ? alertService.getUnread()
                    : Promise.resolve([]),
            ]);

            const [
                horsesResult,
                medicalResult,
                inventoryResult,
                alertsResult,
            ] = results;

            setHorses(
                horsesResult.status === 'fulfilled'
                && Array.isArray(horsesResult.value)
                    ? horsesResult.value
                    : [],
            );

            setMedicalRecords(
                medicalResult.status === 'fulfilled'
                && Array.isArray(medicalResult.value)
                    ? medicalResult.value
                    : [],
            );

            setInventoryItems(
                inventoryResult.status === 'fulfilled'
                && Array.isArray(inventoryResult.value)
                    ? inventoryResult.value
                    : [],
            );

            setAlerts(
                alertsResult.status === 'fulfilled'
                && Array.isArray(alertsResult.value)
                    ? alertsResult.value
                    : [],
            );

            const failedRequest = results.some(
                (result) =>
                    result.status === 'rejected',
            );

            if (failedRequest) {
                setWarning(
                    'Algunos datos del panel no pudieron cargarse.',
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const lowStockItems = useMemo(
        () =>
            inventoryItems.filter((item) => {
                if (item.stockBajo === true) {
                    return true;
                }

                const currentQuantity = Number(
                    item.cantidadActual ?? 0,
                );

                const minimumQuantity = Number(
                    item.stockMinimo ?? 0,
                );

                return (
                    currentQuantity <= minimumQuantity
                );
            }),
        [inventoryItems],
    );

    const recentMedicalRecords = useMemo(
        () =>
            [...medicalRecords]
                .sort(
                    (first, second) =>
                        new Date(second.fecha)
                        - new Date(first.fecha),
                )
                .slice(0, 5),
        [medicalRecords],
    );

    const recentAlerts = useMemo(
        () =>
            [...alerts]
                .sort(
                    (first, second) =>
                        new Date(second.fechaCreacion)
                        - new Date(first.fechaCreacion),
                )
                .slice(0, 5),
        [alerts],
    );

    const stats = [
        {
            label: 'Caballos registrados',
            value: horses.length,
            description: 'Gestión de caballos',
            icon: PawPrint,
        },
        {
            label: 'Registros médicos',
            value: medicalRecords.length,
            description: canSeeMedicalHistory
                ? 'Historial clínico'
                : 'Acceso restringido',
            icon: HeartPulse,
        },
        {
            label: 'Insumos disponibles',
            value: inventoryItems.length,
            description: canSeeInventory
                ? `${lowStockItems.length} con stock bajo`
                : 'Acceso restringido',
            icon: Boxes,
        },
        {
            label: 'Alertas pendientes',
            value: alerts.length,
            description: canSeeAlerts
                ? 'Notificaciones no leídas'
                : 'Acceso restringido',
            icon: Bell,
        },
    ];

    return (
        <>
            <PageHeader
                title={`Bienvenido, ${
                    currentUser?.nombre || 'Usuario'
                }`}
                description="Resumen general de la administración de la caballeriza."
            />

            {warning && (
                <div className="warning-message">
                    {warning}
                </div>
            )}

            {loading ? (
                <div className="empty-state">
                    Cargando información del panel...
                </div>
            ) : (
                <>
                    <section className="stats-grid">
                        {stats.map(
                            ({
                                 label,
                                 value,
                                 description,
                                 icon: Icon,
                             }) => (
                                <article
                                    className="stat-card"
                                    key={label}
                                >
                                    <div className="stat-card-icon">
                                        <Icon size={24} />
                                    </div>

                                    <div>
                                        <span>{label}</span>
                                        <strong>{value}</strong>
                                        <small>
                                            {description}
                                        </small>
                                    </div>
                                </article>
                            ),
                        )}
                    </section>

                    <section className="dashboard-grid">
                        <article className="content-card">
                            <h3>Actividad médica reciente</h3>

                            <p>
                                Últimos registros agregados
                                al historial de los caballos.
                            </p>

                            {!canSeeMedicalHistory ? (
                                <div className="empty-state">
                                    Tu rol no tiene acceso al
                                    historial médico.
                                </div>
                            ) : recentMedicalRecords.length
                            === 0 ? (
                                <div className="empty-state">
                                    Todavía no hay registros
                                    médicos para mostrar.
                                </div>
                            ) : (
                                <div className="dashboard-list">
                                    {recentMedicalRecords.map(
                                        (record) => (
                                            <article
                                                className="dashboard-list-item"
                                                key={record.id}
                                            >
                                                <div className="dashboard-list-icon">
                                                    <HeartPulse
                                                        size={19}
                                                    />
                                                </div>

                                                <div>
                                                    <strong>
                                                        {record.horse
                                                                ?.nombre
                                                            || 'Caballo sin nombre'}
                                                    </strong>

                                                    <span>
                                                        {record.tipo
                                                            || 'Registro médico'}
                                                    </span>

                                                    <small>
                                                        {formatDate(
                                                            record.fecha,
                                                        )}
                                                    </small>
                                                </div>
                                            </article>
                                        ),
                                    )}
                                </div>
                            )}
                        </article>

                        <article className="content-card">
                            <h3>Alertas importantes</h3>

                            <p>
                                Vacunaciones, tratamientos e
                                insumos que requieren atención.
                            </p>

                            {!canSeeAlerts ? (
                                <div className="empty-state">
                                    Tu rol no tiene acceso a
                                    las alertas.
                                </div>
                            ) : recentAlerts.length === 0 ? (
                                <div className="empty-state">
                                    No hay alertas pendientes.
                                </div>
                            ) : (
                                <div className="dashboard-list">
                                    {recentAlerts.map(
                                        (alert) => (
                                            <article
                                                className="dashboard-list-item dashboard-alert-item"
                                                key={alert.id}
                                            >
                                                <div className="dashboard-list-icon dashboard-alert-icon">
                                                    <AlertTriangle
                                                        size={19}
                                                    />
                                                </div>

                                                <div>
                                                    <strong>
                                                        {alert.titulo}
                                                    </strong>

                                                    <span>
                                                        {alert.mensaje}
                                                    </span>

                                                    <small>
                                                        {formatDate(
                                                            alert.fechaCreacion,
                                                        )}
                                                    </small>
                                                </div>
                                            </article>
                                        ),
                                    )}
                                </div>
                            )}
                        </article>
                    </section>

                    {canSeeInventory
                        && lowStockItems.length > 0 && (
                            <section className="content-card dashboard-low-stock">
                                <h3>Insumos con stock bajo</h3>

                                <div className="dashboard-stock-grid">
                                    {lowStockItems.map((item) => (
                                        <article
                                            key={item.id}
                                            className="dashboard-stock-item"
                                        >
                                            <Boxes size={20} />

                                            <div>
                                                <strong>
                                                    {item.nombre}
                                                </strong>

                                                <span>
                                                Existencia:{' '}
                                                    {item.cantidadActual}{' '}
                                                    {item.unidad}
                                            </span>

                                                <small>
                                                    Mínimo:{' '}
                                                    {item.stockMinimo}{' '}
                                                    {item.unidad}
                                                </small>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}
                </>
            )}
        </>
    );
}

export default Dashboard;