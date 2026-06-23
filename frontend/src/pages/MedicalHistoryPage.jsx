import {
    CalendarDays,
    ClipboardList,
    HeartPulse,
    Pencil,
    Pill,
    Plus,
    Save,
    Search,
    Syringe,
    Trash2,
    TriangleAlert,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import PageHeader from '../components/PageHeader';
import horseService from '../services/horseService';
import medicalHistoryService from '../services/medicalHistoryService';

const initialForm = {
    horseId: '',
    tipo: 'VACUNA',
    descripcion: '',
    fecha: '',
    responsable: '',
};

const typeOptions = [
    {
        value: 'VACUNA',
        label: 'Vacuna',
    },
    {
        value: 'TRATAMIENTO',
        label: 'Tratamiento',
    },
    {
        value: 'ALERGIA',
        label: 'Alergia',
    },
    {
        value: 'OBSERVACION',
        label: 'Observación',
    },
];

const typeConfig = {
    VACUNA: {
        label: 'Vacuna',
        icon: Syringe,
    },
    TRATAMIENTO: {
        label: 'Tratamiento',
        icon: Pill,
    },
    ALERGIA: {
        label: 'Alergia',
        icon: TriangleAlert,
    },
    OBSERVACION: {
        label: 'Observación',
        icon: ClipboardList,
    },
};

function getErrorMessage(requestError, fallbackMessage) {
    const responseData = requestError.response?.data;

    if (typeof responseData === 'string') {
        return responseData;
    }

    if (responseData?.error) {
        return responseData.error;
    }

    if (responseData?.message) {
        return responseData.message;
    }

    if (responseData && typeof responseData === 'object') {
        const firstMessage = Object.values(responseData).find(
            (value) => typeof value === 'string',
        );

        if (firstMessage) {
            return firstMessage;
        }
    }

    return fallbackMessage;
}

function formatDate(date) {
    if (!date) {
        return 'Sin fecha';
    }

    const [year, month, day] = date.split('-');

    if (!year || !month || !day) {
        return date;
    }

    return `${day}/${month}/${year}`;
}

function MedicalHistoryPage() {
    const [histories, setHistories] = useState([]);
    const [horses, setHorses] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [horseFilter, setHorseFilter] = useState('TODOS');
    const [typeFilter, setTypeFilter] = useState('TODOS');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const filteredHistories = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return histories
            .filter((history) => {
                if (horseFilter === 'TODOS') {
                    return true;
                }

                return String(history.horse?.id) === horseFilter;
            })
            .filter((history) => {
                if (typeFilter === 'TODOS') {
                    return true;
                }

                return history.tipo === typeFilter;
            })
            .filter((history) => {
                if (!searchValue) {
                    return true;
                }

                return [
                    history.descripcion,
                    history.responsable,
                    history.horse?.nombre,
                    history.horse?.identificador,
                    history.tipo,
                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value)
                            .toLowerCase()
                            .includes(searchValue),
                    );
            })
            .sort((first, second) =>
                String(second.fecha).localeCompare(String(first.fecha)),
            );
    }, [
        histories,
        horseFilter,
        typeFilter,
        search,
    ]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const [historyData, horseData] = await Promise.all([
                medicalHistoryService.getAll(),
                horseService.getAll(),
            ]);

            setHistories(
                Array.isArray(historyData) ? historyData : [],
            );

            setHorses(
                Array.isArray(horseData) ? horseData : [],
            );
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible cargar el historial médico.',
                ),
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
        setShowForm(false);
        setError('');
    };

    const openCreateForm = () => {
        setForm(initialForm);
        setEditingId(null);
        setShowForm(true);
        setError('');
    };

    const openEditForm = (history) => {
        setForm({
            horseId: String(history.horse?.id ?? ''),
            tipo: history.tipo ?? 'VACUNA',
            descripcion: history.descripcion ?? '',
            fecha: history.fecha ?? '',
            responsable: history.responsable ?? '',
        });

        setEditingId(history.id);
        setShowForm(true);
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !form.horseId
            || !form.tipo
            || !form.descripcion.trim()
            || !form.fecha
            || !form.responsable.trim()
        ) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        const medicalHistoryData = {
            horse: {
                id: Number(form.horseId),
            },
            tipo: form.tipo,
            descripcion: form.descripcion.trim(),
            fecha: form.fecha,
            responsable: form.responsable.trim(),
        };

        try {
            setSaving(true);
            setError('');

            if (editingId) {
                await medicalHistoryService.update(
                    editingId,
                    medicalHistoryData,
                );
            } else {
                await medicalHistoryService.create(
                    medicalHistoryData,
                );
            }

            resetForm();
            await loadData();
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible guardar el historial médico.',
                ),
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (history) => {
        const confirmed = window.confirm(
            '¿Deseás eliminar este registro médico?',
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');
            await medicalHistoryService.remove(history.id);
            await loadData();
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible eliminar el registro.',
                ),
            );
        }
    };

    return (
        <>
            <PageHeader
                title="Historial médico"
                description="Vacunas, tratamientos, alergias, observaciones y responsables."
                action={(
                    <button
                        className="primary-button"
                        type="button"
                        onClick={openCreateForm}
                        disabled={horses.length === 0}
                    >
                        <Plus size={19} />
                        Nuevo registro
                    </button>
                )}
            />

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {horses.length === 0 && !loading && (
                <div className="warning-message">
                    Primero debés registrar al menos un caballo.
                </div>
            )}

            {showForm && (
                <section className="content-card form-card">
                    <div className="card-heading">
                        <div>
                            <h3>
                                {editingId
                                    ? 'Editar registro médico'
                                    : 'Nuevo registro médico'}
                            </h3>

                            <p>
                                Seleccioná el caballo y completá la información
                                médica.
                            </p>
                        </div>

                        <button
                            className="icon-button"
                            type="button"
                            onClick={resetForm}
                            aria-label="Cerrar formulario"
                        >
                            <X size={19} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <label className="form-field">
                                <span>Caballo *</span>

                                <select
                                    name="horseId"
                                    value={form.horseId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Seleccionar caballo
                                    </option>

                                    {horses.map((horse) => (
                                        <option
                                            key={horse.id}
                                            value={horse.id}
                                        >
                                            {horse.nombre} - {horse.identificador}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="form-field">
                                <span>Tipo de registro *</span>

                                <select
                                    name="tipo"
                                    value={form.tipo}
                                    onChange={handleChange}
                                    required
                                >
                                    {typeOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="form-field">
                                <span>Fecha *</span>

                                <input
                                    name="fecha"
                                    type="date"
                                    value={form.fecha}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label className="form-field">
                                <span>Responsable *</span>

                                <input
                                    name="responsable"
                                    value={form.responsable}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: Dr. Carlos Pérez"
                                    required
                                />
                            </label>

                            <label className="form-field form-field-full">
                                <span>Descripción *</span>

                                <textarea
                                    name="descripcion"
                                    value={form.descripcion}
                                    onChange={handleChange}
                                    placeholder="Describí la vacuna, tratamiento, alergia u observación."
                                    rows="4"
                                    required
                                />
                            </label>
                        </div>

                        <div className="form-actions">
                            <button
                                className="secondary-button"
                                type="button"
                                onClick={resetForm}
                            >
                                Cancelar
                            </button>

                            <button
                                className="primary-button"
                                type="submit"
                                disabled={saving}
                            >
                                <Save size={18} />

                                {saving
                                    ? 'Guardando...'
                                    : 'Guardar registro'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="content-card filters-card">
                <div className="filters-grid">
                    <label className="form-field">
                        <span>Filtrar por caballo</span>

                        <select
                            value={horseFilter}
                            onChange={(event) =>
                                setHorseFilter(event.target.value)}
                        >
                            <option value="TODOS">
                                Todos los caballos
                            </option>

                            {horses.map((horse) => (
                                <option
                                    key={horse.id}
                                    value={horse.id}
                                >
                                    {horse.nombre}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="form-field">
                        <span>Filtrar por tipo</span>

                        <select
                            value={typeFilter}
                            onChange={(event) =>
                                setTypeFilter(event.target.value)}
                        >
                            <option value="TODOS">
                                Todos los tipos
                            </option>

                            {typeOptions.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="form-field">
                        <span>Buscar</span>

                        <div className="search-field history-search">
                            <Search size={18} />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)}
                                placeholder="Descripción o responsable"
                            />
                        </div>
                    </label>
                </div>
            </section>

            <section className="content-card">
                <div className="history-heading">
                    <div>
                        <h3>Cronología médica</h3>
                        <p>
                            Registros encontrados: {filteredHistories.length}
                        </p>
                    </div>

                    <HeartPulse size={26} />
                </div>

                {loading ? (
                    <div className="empty-state">
                        Cargando historial médico...
                    </div>
                ) : filteredHistories.length === 0 ? (
                    <div className="empty-state">
                        No hay registros médicos para mostrar.
                    </div>
                ) : (
                    <div className="history-timeline">
                        {filteredHistories.map((history) => {
                            const config =
                                typeConfig[history.tipo]
                                || typeConfig.OBSERVACION;

                            const TypeIcon = config.icon;

                            return (
                                <article
                                    className="history-item"
                                    key={history.id}
                                >
                                    <div className="history-marker">
                                        <TypeIcon size={21} />
                                    </div>

                                    <div className="history-content">
                                        <div className="history-topline">
                                            <div>
                        <span
                            className={`history-type-badge history-type-${history.tipo?.toLowerCase()}`}
                        >
                          {config.label}
                        </span>

                                                <h4>
                                                    {history.horse?.nombre
                                                        || 'Caballo no disponible'}
                                                </h4>
                                            </div>

                                            <div className="history-date">
                                                <CalendarDays size={17} />
                                                {formatDate(history.fecha)}
                                            </div>
                                        </div>

                                        <p className="history-description">
                                            {history.descripcion}
                                        </p>

                                        <div className="history-meta">
                      <span>
                        <strong>Identificador:</strong>{' '}
                          {history.horse?.identificador || 'N/D'}
                      </span>

                                            <span>
                        <strong>Responsable:</strong>{' '}
                                                {history.responsable}
                      </span>
                                        </div>
                                    </div>

                                    <div className="history-actions">
                                        <button
                                            className="table-icon-button"
                                            type="button"
                                            onClick={() =>
                                                openEditForm(history)}
                                            aria-label="Editar registro"
                                        >
                                            <Pencil size={17} />
                                        </button>

                                        <button
                                            className="table-icon-button danger"
                                            type="button"
                                            onClick={() =>
                                                handleDelete(history)}
                                            aria-label="Eliminar registro"
                                        >
                                            <Trash2 size={17} />
                                        </button>
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

export default MedicalHistoryPage;