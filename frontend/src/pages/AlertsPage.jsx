import {
    AlertTriangle,
    BellRing,
    CheckCheck,
    Eye,
    EyeOff,
    PackageSearch,
    Plus,
    RefreshCw,
    Trash2,
} from 'lucide-react';
import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import PageHeader from '../components/PageHeader';
import alertService from '../services/alertService';
import authService from '../services/authService';

const initialForm = {
    tipo: 'GENERAL',
    titulo: '',
    mensaje: '',
};

const typeOptions = [
    {
        value: 'GENERAL',
        label: 'General',
    },
    {
        value: 'VACUNACION',
        label: 'Vacunación',
    },
    {
        value: 'TRATAMIENTO',
        label: 'Tratamiento',
    },
    {
        value: 'STOCK_BAJO',
        label: 'Stock bajo',
    },
];

function getErrorMessage(error, defaultMessage) {
    const responseData = error.response?.data;

    if (typeof responseData === 'string') {
        return responseData;
    }

    if (responseData?.error) {
        return responseData.error;
    }

    if (responseData?.message) {
        return responseData.message;
    }

    return defaultMessage;
}

function formatType(type) {
    const option = typeOptions.find(
        (currentOption) =>
            currentOption.value === type,
    );

    return option?.label || type || 'General';
}

function formatDate(dateValue) {
    if (!dateValue) {
        return 'Fecha no disponible';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return new Intl.DateTimeFormat('es-CR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
}

function AlertsPage() {
    const currentUser = authService.getStoredUser();
    const canDelete =
        currentUser?.rol === 'ADMINISTRADOR';

    const [alerts, setAlerts] = useState([]);
    const [filter, setFilter] = useState('TODAS');
    const [form, setForm] = useState(initialForm);

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [processingId, setProcessingId] =
        useState(null);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const unreadCount = alerts.filter(
        (alert) => !alert.leida,
    ).length;

    const readCount = alerts.filter(
        (alert) => alert.leida,
    ).length;

    const filteredAlerts = useMemo(() => {
        if (filter === 'NO_LEIDAS') {
            return alerts.filter(
                (alert) => !alert.leida,
            );
        }

        if (filter === 'LEIDAS') {
            return alerts.filter(
                (alert) => alert.leida,
            );
        }

        return alerts;
    }, [alerts, filter]);

    const loadAlerts = async (
        generateStockAlerts = false,
    ) => {
        try {
            setLoading(true);
            setError('');

            if (generateStockAlerts) {
                await alertService.generateLowStock();
            }

            const data = await alertService.getAll();

            const sortedAlerts = Array.isArray(data)
                ? [...data].sort(
                    (first, second) =>
                        new Date(second.fechaCreacion)
                        - new Date(first.fechaCreacion),
                )
                : [];

            setAlerts(sortedAlerts);
        } catch (requestError) {
            setAlerts([]);

            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible cargar las alertas.',
                ),
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAlerts();
    }, []);

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };

    const handleCreate = async (event) => {
        event.preventDefault();

        if (
            !form.titulo.trim()
            || !form.mensaje.trim()
        ) {
            setError(
                'El título y el mensaje son obligatorios.',
            );
            return;
        }

        try {
            setCreating(true);
            setMessage('');
            setError('');

            await alertService.create({
                tipo: form.tipo,
                titulo: form.titulo.trim(),
                mensaje: form.mensaje.trim(),
                leida: false,
            });

            setForm(initialForm);

            setMessage(
                'Alerta registrada correctamente.',
            );

            await loadAlerts();
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible registrar la alerta.',
                ),
            );
        } finally {
            setCreating(false);
        }
    };

    const handleGenerateLowStock = async () => {
        try {
            setGenerating(true);
            setMessage('');
            setError('');

            await alertService.generateLowStock();

            setMessage(
                'Se revisó el inventario y se generaron las alertas necesarias.',
            );

            await loadAlerts();
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible generar las alertas de stock bajo.',
                ),
            );
        } finally {
            setGenerating(false);
        }
    };

    const handleToggleRead = async (alert) => {
        try {
            setProcessingId(alert.id);
            setMessage('');
            setError('');

            const updatedAlert = alert.leida
                ? await alertService.markAsUnread(
                    alert.id,
                )
                : await alertService.markAsRead(
                    alert.id,
                );

            setAlerts((currentAlerts) =>
                currentAlerts.map((current) =>
                    current.id === alert.id
                        ? updatedAlert
                        : current,
                ),
            );

            setMessage(
                alert.leida
                    ? 'Alerta marcada como no leída.'
                    : 'Alerta marcada como leída.',
            );
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible cambiar el estado de la alerta.',
                ),
            );
        } finally {
            setProcessingId(null);
        }
    };

    const handleMarkAllAsRead = async () => {
        const unreadAlerts = alerts.filter(
            (alert) => !alert.leida,
        );

        if (unreadAlerts.length === 0) {
            setMessage(
                'No existen alertas pendientes.',
            );
            return;
        }

        try {
            setLoading(true);
            setMessage('');
            setError('');

            await Promise.all(
                unreadAlerts.map((alert) =>
                    alertService.markAsRead(alert.id),
                ),
            );

            setMessage(
                'Todas las alertas fueron marcadas como leídas.',
            );

            await loadAlerts();
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible marcar todas las alertas.',
                ),
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (alert) => {
        const confirmed = window.confirm(
            `¿Deseás eliminar la alerta "${alert.titulo}"?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setProcessingId(alert.id);
            setMessage('');
            setError('');

            await alertService.remove(alert.id);

            setAlerts((currentAlerts) =>
                currentAlerts.filter(
                    (current) =>
                        current.id !== alert.id,
                ),
            );

            setMessage(
                'Alerta eliminada correctamente.',
            );
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible eliminar la alerta.',
                ),
            );
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <>
            <PageHeader
                title="Alertas y notificaciones"
                description="Bandeja de vacunaciones, tratamientos, inventario y avisos generales."
            />

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <section className="alert-stats-grid">
                <article className="alert-stat-card">
                    <BellRing size={24} />

                    <div>
                        <span>Total de alertas</span>
                        <strong>{alerts.length}</strong>
                    </div>
                </article>

                <article className="alert-stat-card">
                    <AlertTriangle size={24} />

                    <div>
                        <span>No leídas</span>
                        <strong>{unreadCount}</strong>
                    </div>
                </article>

                <article className="alert-stat-card">
                    <CheckCheck size={24} />

                    <div>
                        <span>Leídas</span>
                        <strong>{readCount}</strong>
                    </div>
                </article>
            </section>

            <section className="content-card alert-form-card">
                <div className="card-heading">
                    <div>
                        <h3>Registrar alerta</h3>

                        <p>
                            Creá avisos de vacunación,
                            tratamientos o situaciones generales.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleCreate}>
                    <div className="alert-form-grid">
                        <label className="form-field">
                            <span>Tipo</span>

                            <select
                                name="tipo"
                                value={form.tipo}
                                onChange={handleFormChange}
                            >
                                {typeOptions.map(
                                    (option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ),
                                )}
                            </select>
                        </label>

                        <label className="form-field">
                            <span>Título</span>

                            <input
                                name="titulo"
                                value={form.titulo}
                                onChange={handleFormChange}
                                placeholder="Ejemplo: Próxima vacunación"
                                required
                            />
                        </label>

                        <label className="form-field form-field-full">
                            <span>Mensaje</span>

                            <textarea
                                name="mensaje"
                                value={form.mensaje}
                                onChange={handleFormChange}
                                placeholder="Escribí la información de la alerta"
                                required
                            />
                        </label>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="primary-button"
                            disabled={creating}
                        >
                            <Plus size={18} />

                            {creating
                                ? 'Registrando...'
                                : 'Registrar alerta'}
                        </button>
                    </div>
                </form>
            </section>

            <section className="content-card">
                <div className="alerts-toolbar">
                    <div>
                        <h3>Alertas registradas</h3>

                        <p>
                            Consultá y administrá las
                            notificaciones del sistema.
                        </p>
                    </div>

                    <div className="alerts-toolbar-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={
                                handleGenerateLowStock
                            }
                            disabled={generating}
                        >
                            <PackageSearch size={18} />

                            {generating
                                ? 'Revisando...'
                                : 'Revisar stock'}
                        </button>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={
                                handleMarkAllAsRead
                            }
                            disabled={
                                loading
                                || unreadCount === 0
                            }
                        >
                            <CheckCheck size={18} />
                            Marcar todas leídas
                        </button>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => loadAlerts()}
                            disabled={loading}
                        >
                            <RefreshCw size={18} />
                            Actualizar
                        </button>
                    </div>
                </div>

                <div className="alert-filter-buttons">
                    <button
                        type="button"
                        className={
                            filter === 'TODAS'
                                ? 'alert-filter-active'
                                : ''
                        }
                        onClick={() =>
                            setFilter('TODAS')}
                    >
                        Todas
                    </button>

                    <button
                        type="button"
                        className={
                            filter === 'NO_LEIDAS'
                                ? 'alert-filter-active'
                                : ''
                        }
                        onClick={() =>
                            setFilter('NO_LEIDAS')}
                    >
                        No leídas
                    </button>

                    <button
                        type="button"
                        className={
                            filter === 'LEIDAS'
                                ? 'alert-filter-active'
                                : ''
                        }
                        onClick={() =>
                            setFilter('LEIDAS')}
                    >
                        Leídas
                    </button>
                </div>

                {loading ? (
                    <div className="empty-state">
                        Cargando alertas...
                    </div>
                ) : filteredAlerts.length === 0 ? (
                    <div className="empty-state">
                        No existen alertas para mostrar.
                    </div>
                ) : (
                    <div className="alerts-list">
                        {filteredAlerts.map((alert) => {
                            const processing =
                                processingId === alert.id;

                            return (
                                <article
                                    key={alert.id}
                                    className={
                                        alert.leida
                                            ? 'alert-item alert-item-read'
                                            : 'alert-item alert-item-unread'
                                    }
                                >
                                    <div
                                        className={
                                            `alert-type-icon alert-type-${alert.tipo?.toLowerCase()}`
                                        }
                                    >
                                        {alert.tipo
                                        === 'STOCK_BAJO' ? (
                                            <PackageSearch
                                                size={22}
                                            />
                                        ) : (
                                            <BellRing
                                                size={22}
                                            />
                                        )}
                                    </div>

                                    <div className="alert-item-content">
                                        <div className="alert-item-header">
                                            <div>
                                                <span className="alert-type-badge">
                                                    {formatType(
                                                        alert.tipo,
                                                    )}
                                                </span>

                                                <h4>
                                                    {alert.titulo}
                                                </h4>
                                            </div>

                                            <span className="alert-date">
                                                {formatDate(
                                                    alert.fechaCreacion,
                                                )}
                                            </span>
                                        </div>

                                        <p>{alert.mensaje}</p>

                                        <span
                                            className={
                                                alert.leida
                                                    ? 'alert-read-status'
                                                    : 'alert-unread-status'
                                            }
                                        >
                                            {alert.leida
                                                ? 'Leída'
                                                : 'Pendiente'}
                                        </span>
                                    </div>

                                    <div className="alert-item-actions">
                                        <button
                                            type="button"
                                            className="table-icon-button"
                                            onClick={() =>
                                                handleToggleRead(
                                                    alert,
                                                )}
                                            disabled={processing}
                                            title={
                                                alert.leida
                                                    ? 'Marcar como no leída'
                                                    : 'Marcar como leída'
                                            }
                                        >
                                            {alert.leida ? (
                                                <EyeOff
                                                    size={18}
                                                />
                                            ) : (
                                                <Eye
                                                    size={18}
                                                />
                                            )}
                                        </button>

                                        {canDelete && (
                                            <button
                                                type="button"
                                                className="table-icon-button danger"
                                                onClick={() =>
                                                    handleDelete(
                                                        alert,
                                                    )}
                                                disabled={
                                                    processing
                                                }
                                                title="Eliminar alerta"
                                            >
                                                <Trash2
                                                    size={18}
                                                />
                                            </button>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </>
    );
}

export default AlertsPage;