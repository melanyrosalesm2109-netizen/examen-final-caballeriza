import {
    Apple,
    Clock3,
    Pencil,
    Plus,
    Save,
    Search,
    Trash2,
    Utensils,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import PageHeader from '../components/PageHeader';
import feedingPlanService from '../services/feedingPlanService';
import horseService from '../services/horseService';

const initialForm = {
    horseId: '',
    tipoAlimento: '',
    cantidad: '',
    frecuencia: '',
    observaciones: '',
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

function FeedingPlansPage() {
    const [feedingPlans, setFeedingPlans] = useState([]);
    const [horses, setHorses] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [horseFilter, setHorseFilter] = useState('TODOS');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const filteredPlans = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return feedingPlans.filter((plan) => {
            const matchesHorse =
                horseFilter === 'TODOS'
                || String(plan.horse?.id) === horseFilter;

            const matchesSearch =
                !searchValue
                || [
                    plan.horse?.nombre,
                    plan.horse?.identificador,
                    plan.tipoAlimento,
                    plan.cantidad,
                    plan.frecuencia,
                    plan.observaciones,
                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value)
                            .toLowerCase()
                            .includes(searchValue),
                    );

            return matchesHorse && matchesSearch;
        });
    }, [feedingPlans, horseFilter, search]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const [plansData, horsesData] = await Promise.all([
                feedingPlanService.getAll(),
                horseService.getAll(),
            ]);

            setFeedingPlans(
                Array.isArray(plansData) ? plansData : [],
            );

            setHorses(
                Array.isArray(horsesData) ? horsesData : [],
            );
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible cargar los planes de alimentación.',
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

    const openEditForm = (plan) => {
        setForm({
            horseId: String(plan.horse?.id ?? ''),
            tipoAlimento: plan.tipoAlimento ?? '',
            cantidad: plan.cantidad ?? '',
            frecuencia: plan.frecuencia ?? '',
            observaciones: plan.observaciones ?? '',
        });

        setEditingId(plan.id);
        setShowForm(true);
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !form.horseId
            || !form.tipoAlimento.trim()
            || !form.cantidad.trim()
            || !form.frecuencia.trim()
        ) {
            setError(
                'El caballo, alimento, cantidad y frecuencia son obligatorios.',
            );

            return;
        }

        const feedingPlanData = {
            horse: {
                id: Number(form.horseId),
            },
            tipoAlimento: form.tipoAlimento.trim(),
            cantidad: form.cantidad.trim(),
            frecuencia: form.frecuencia.trim(),
            observaciones:
                form.observaciones.trim() || null,
        };

        try {
            setSaving(true);
            setError('');

            if (editingId) {
                await feedingPlanService.update(
                    editingId,
                    feedingPlanData,
                );
            } else {
                await feedingPlanService.create(
                    feedingPlanData,
                );
            }

            resetForm();
            await loadData();
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible guardar el plan de alimentación.',
                ),
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (plan) => {
        const confirmed = window.confirm(
            `¿Deseás eliminar el plan de ${plan.horse?.nombre ?? 'este caballo'}?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');
            await feedingPlanService.remove(plan.id);
            await loadData();
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible eliminar el plan de alimentación.',
                ),
            );
        }
    };

    return (
        <>
            <PageHeader
                title="Planes de alimentación"
                description="Asignación y seguimiento de la alimentación de cada caballo."
                action={(
                    <button
                        className="primary-button"
                        type="button"
                        onClick={openCreateForm}
                        disabled={horses.length === 0}
                    >
                        <Plus size={19} />
                        Nuevo plan
                    </button>
                )}
            />

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {!loading && horses.length === 0 && (
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
                                    ? 'Editar plan de alimentación'
                                    : 'Registrar plan de alimentación'}
                            </h3>

                            <p>
                                Completá la alimentación asignada al caballo.
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
                                <span>Tipo de alimento *</span>

                                <input
                                    name="tipoAlimento"
                                    value={form.tipoAlimento}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: Heno premium"
                                    required
                                />
                            </label>

                            <label className="form-field">
                                <span>Cantidad *</span>

                                <input
                                    name="cantidad"
                                    value={form.cantidad}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: 5 kg"
                                    required
                                />
                            </label>

                            <label className="form-field">
                                <span>Frecuencia *</span>

                                <input
                                    name="frecuencia"
                                    value={form.frecuencia}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: Dos veces al día"
                                    required
                                />
                            </label>

                            <label className="form-field form-field-full">
                                <span>Observaciones</span>

                                <textarea
                                    name="observaciones"
                                    value={form.observaciones}
                                    onChange={handleChange}
                                    placeholder="Indicaciones adicionales del plan."
                                    rows="4"
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
                                    : 'Guardar plan'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="content-card filters-card">
                <div className="feeding-filters">
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
                        <span>Buscar</span>

                        <div className="search-field history-search">
                            <Search size={18} />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)}
                                placeholder="Alimento, frecuencia o caballo"
                            />
                        </div>
                    </label>
                </div>
            </section>

            <section className="content-card">
                <div className="feeding-heading">
                    <div>
                        <h3>Planes registrados</h3>
                        <p>
                            Total: {filteredPlans.length}
                        </p>
                    </div>

                    <Utensils size={27} />
                </div>

                {loading ? (
                    <div className="empty-state">
                        Cargando planes de alimentación...
                    </div>
                ) : filteredPlans.length === 0 ? (
                    <div className="empty-state">
                        No hay planes de alimentación para mostrar.
                    </div>
                ) : (
                    <div className="feeding-grid">
                        {filteredPlans.map((plan) => (
                            <article
                                className="feeding-card"
                                key={plan.id}
                            >
                                <div className="feeding-card-top">
                                    <div className="feeding-icon">
                                        <Apple size={23} />
                                    </div>

                                    <div className="table-actions">
                                        <button
                                            className="table-icon-button"
                                            type="button"
                                            onClick={() => openEditForm(plan)}
                                            aria-label="Editar plan"
                                        >
                                            <Pencil size={17} />
                                        </button>

                                        <button
                                            className="table-icon-button danger"
                                            type="button"
                                            onClick={() => handleDelete(plan)}
                                            aria-label="Eliminar plan"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                </div>

                                <div className="feeding-horse">
                                    <h4>
                                        {plan.horse?.nombre
                                            ?? 'Caballo no disponible'}
                                    </h4>

                                    <span>
                    {plan.horse?.identificador ?? 'N/D'}
                  </span>
                                </div>

                                <div className="feeding-detail">
                                    <Apple size={18} />

                                    <div>
                                        <span>Alimento</span>
                                        <strong>{plan.tipoAlimento}</strong>
                                    </div>
                                </div>

                                <div className="feeding-detail">
                                    <Utensils size={18} />

                                    <div>
                                        <span>Cantidad</span>
                                        <strong>{plan.cantidad}</strong>
                                    </div>
                                </div>

                                <div className="feeding-detail">
                                    <Clock3 size={18} />

                                    <div>
                                        <span>Frecuencia</span>
                                        <strong>{plan.frecuencia}</strong>
                                    </div>
                                </div>

                                <div className="feeding-observations">
                                    <span>Observaciones</span>

                                    <p>
                                        {plan.observaciones
                                            || 'Sin observaciones adicionales.'}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

export default FeedingPlansPage;