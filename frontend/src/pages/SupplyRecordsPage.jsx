import {
    CalendarDays,
    ClipboardList,
    PackageCheck,
    Pencil,
    Plus,
    Save,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import PageHeader from '../components/PageHeader';
import horseService from '../services/horseService';
import inventoryService from '../services/inventoryService';
import supplyRecordService from '../services/supplyRecordService';

const initialForm = {
    horseId: '',
    inventoryItemId: '',
    fecha: '',
    cantidad: '',
    responsable: '',
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

function SupplyRecordsPage() {
    const [records, setRecords] = useState([]);
    const [horses, setHorses] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [horseFilter, setHorseFilter] = useState('TODOS');
    const [itemFilter, setItemFilter] = useState('TODOS');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const filteredRecords = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return records
            .filter((record) => {
                if (horseFilter === 'TODOS') {
                    return true;
                }

                return String(record.horse?.id) === horseFilter;
            })
            .filter((record) => {
                if (itemFilter === 'TODOS') {
                    return true;
                }

                return (
                    String(record.inventoryItem?.id) === itemFilter
                );
            })
            .filter((record) => {
                if (!searchValue) {
                    return true;
                }

                return [
                    record.horse?.nombre,
                    record.horse?.identificador,
                    record.inventoryItem?.nombre,
                    record.responsable,
                    record.observaciones,
                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value)
                            .toLowerCase()
                            .includes(searchValue),
                    );
            })
            .sort((first, second) =>
                String(second.fecha).localeCompare(
                    String(first.fecha),
                ),
            );
    }, [
        records,
        horseFilter,
        itemFilter,
        search,
    ]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const [
                recordsData,
                horsesData,
                inventoryData,
            ] = await Promise.all([
                supplyRecordService.getAll(),
                horseService.getAll(),
                inventoryService.getAll(),
            ]);

            setRecords(
                Array.isArray(recordsData) ? recordsData : [],
            );

            setHorses(
                Array.isArray(horsesData) ? horsesData : [],
            );

            setInventoryItems(
                Array.isArray(inventoryData) ? inventoryData : [],
            );
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible cargar los suministros.',
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

    const openEditForm = (record) => {
        setForm({
            horseId: String(record.horse?.id ?? ''),
            inventoryItemId: String(
                record.inventoryItem?.id ?? '',
            ),
            fecha: record.fecha ?? '',
            cantidad: record.cantidad ?? '',
            responsable: record.responsable ?? '',
            observaciones: record.observaciones ?? '',
        });

        setEditingId(record.id);
        setShowForm(true);
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !form.horseId
            || !form.inventoryItemId
            || !form.fecha
            || form.cantidad === ''
        ) {
            setError(
                'El caballo, el insumo, la fecha y la cantidad son obligatorios.',
            );

            return;
        }

        if (Number(form.cantidad) < 0.1) {
            setError('La cantidad debe ser mayor a cero.');
            return;
        }

        const supplyData = {
            horse: {
                id: Number(form.horseId),
            },
            inventoryItem: {
                id: Number(form.inventoryItemId),
            },
            fecha: form.fecha,
            cantidad: Number(form.cantidad),
            responsable:
                form.responsable.trim() || null,
            observaciones:
                form.observaciones.trim() || null,
        };

        try {
            setSaving(true);
            setError('');

            if (editingId) {
                await supplyRecordService.update(
                    editingId,
                    supplyData,
                );
            } else {
                await supplyRecordService.create(supplyData);
            }

            resetForm();
            await loadData();
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible guardar el suministro.',
                ),
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (record) => {
        const confirmed = window.confirm(
            `¿Deseás eliminar el suministro de ${
                record.inventoryItem?.nombre ?? 'este insumo'
            }?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');
            await supplyRecordService.remove(record.id);
            await loadData();
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible eliminar el suministro.',
                ),
            );
        }
    };

    return (
        <>
            <PageHeader
                title="Registro de suministros"
                description="Control de los insumos entregados a cada caballo."
                action={(
                    <button
                        className="primary-button"
                        type="button"
                        onClick={openCreateForm}
                        disabled={
                            horses.length === 0
                            || inventoryItems.length === 0
                        }
                    >
                        <Plus size={19} />
                        Nuevo suministro
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

            {!loading && inventoryItems.length === 0 && (
                <div className="warning-message">
                    Primero debés registrar al menos un insumo en
                    inventario.
                </div>
            )}

            {showForm && (
                <section className="content-card form-card">
                    <div className="card-heading">
                        <div>
                            <h3>
                                {editingId
                                    ? 'Editar suministro'
                                    : 'Registrar suministro'}
                            </h3>

                            <p>
                                Seleccioná el caballo, el insumo y la cantidad
                                entregada.
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
                                <span>Insumo *</span>

                                <select
                                    name="inventoryItemId"
                                    value={form.inventoryItemId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Seleccionar insumo
                                    </option>

                                    {inventoryItems.map((item) => (
                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.nombre} - {item.cantidadActual}{' '}
                                            {item.unidad}
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
                                <span>Cantidad *</span>

                                <input
                                    name="cantidad"
                                    type="number"
                                    min="0.1"
                                    step="0.01"
                                    value={form.cantidad}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: 5"
                                    required
                                />
                            </label>

                            <label className="form-field">
                                <span>Responsable</span>

                                <input
                                    name="responsable"
                                    value={form.responsable}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: Melany Rosales"
                                />
                            </label>

                            <label className="form-field form-field-full">
                                <span>Observaciones</span>

                                <textarea
                                    name="observaciones"
                                    value={form.observaciones}
                                    onChange={handleChange}
                                    placeholder="Detalles adicionales del suministro."
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
                                    : 'Guardar suministro'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="content-card filters-card">
                <div className="supply-filters">
                    <label className="form-field">
                        <span>Caballo</span>

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
                        <span>Insumo</span>

                        <select
                            value={itemFilter}
                            onChange={(event) =>
                                setItemFilter(event.target.value)}
                        >
                            <option value="TODOS">
                                Todos los insumos
                            </option>

                            {inventoryItems.map((item) => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.nombre}
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
                                placeholder="Caballo, insumo o responsable"
                            />
                        </div>
                    </label>
                </div>
            </section>

            <section className="content-card">
                <div className="feeding-heading">
                    <div>
                        <h3>Suministros registrados</h3>
                        <p>Total: {filteredRecords.length}</p>
                    </div>

                    <PackageCheck size={27} />
                </div>

                {loading ? (
                    <div className="empty-state">
                        Cargando suministros...
                    </div>
                ) : filteredRecords.length === 0 ? (
                    <div className="empty-state">
                        No hay suministros para mostrar.
                    </div>
                ) : (
                    <div className="supply-records-list">
                        {filteredRecords.map((record) => (
                            <article
                                className="supply-record-card"
                                key={record.id}
                            >
                                <div className="supply-record-icon">
                                    <PackageCheck size={23} />
                                </div>

                                <div className="supply-record-content">
                                    <div className="supply-record-top">
                                        <div>
                      <span className="status-badge">
                        {record.inventoryItem?.tipo
                            ?? 'INSUMO'}
                      </span>

                                            <h4>
                                                {record.inventoryItem?.nombre
                                                    ?? 'Insumo no disponible'}
                                            </h4>
                                        </div>

                                        <div className="supply-record-date">
                                            <CalendarDays size={17} />
                                            {formatDate(record.fecha)}
                                        </div>
                                    </div>

                                    <div className="supply-record-details">
                                        <div>
                                            <span>Caballo</span>
                                            <strong>
                                                {record.horse?.nombre
                                                    ?? 'No disponible'}
                                            </strong>

                                            <small>
                                                {record.horse?.identificador
                                                    ?? 'N/D'}
                                            </small>
                                        </div>

                                        <div>
                                            <span>Cantidad entregada</span>
                                            <strong>
                                                {record.cantidad}{' '}
                                                {record.inventoryItem?.unidad ?? ''}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Responsable</span>
                                            <strong>
                                                {record.responsable
                                                    || 'No indicado'}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="supply-record-observations">
                                        <ClipboardList size={17} />

                                        <span>
                      {record.observaciones
                          || 'Sin observaciones adicionales.'}
                    </span>
                                    </div>
                                </div>

                                <div className="history-actions">
                                    <button
                                        className="table-icon-button"
                                        type="button"
                                        onClick={() => openEditForm(record)}
                                        aria-label="Editar suministro"
                                    >
                                        <Pencil size={17} />
                                    </button>

                                    <button
                                        className="table-icon-button danger"
                                        type="button"
                                        onClick={() => handleDelete(record)}
                                        aria-label="Eliminar suministro"
                                    >
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

export default SupplyRecordsPage;