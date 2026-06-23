import {
    AlertTriangle,
    Boxes,
    Pencil,
    Plus,
    Save,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import PageHeader from '../components/PageHeader';
import inventoryService from '../services/inventoryService';

const initialForm = {
    nombre: '',
    tipo: 'ALIMENTO',
    cantidadActual: '',
    stockMinimo: '',
    unidad: '',
};

const typeOptions = [
    { value: 'ALIMENTO', label: 'Alimento' },
    { value: 'MEDICINA', label: 'Medicina' },
    { value: 'LIMPIEZA', label: 'Limpieza' },
    { value: 'OTRO', label: 'Otro' },
];

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

    return fallbackMessage;
}

function InventoryPage() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [typeFilter, setTypeFilter] = useState('TODOS');
    const [onlyLowStock, setOnlyLowStock] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const filteredItems = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return items.filter((item) => {
            const matchesType =
                typeFilter === 'TODOS' || item.tipo === typeFilter;

            const stockBajo =
                Number(item.cantidadActual) <= Number(item.stockMinimo);

            const matchesStock = !onlyLowStock || stockBajo;

            const matchesSearch =
                !searchValue
                || [item.nombre, item.tipo, item.unidad]
                    .filter(Boolean)
                    .some((value) =>
                        String(value).toLowerCase().includes(searchValue),
                    );

            return matchesType && matchesStock && matchesSearch;
        });
    }, [items, typeFilter, onlyLowStock, search]);

    const loadItems = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await inventoryService.getAll();
            setItems(Array.isArray(data) ? data : []);
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible cargar el inventario.',
                ),
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
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

    const openEditForm = (item) => {
        setForm({
            nombre: item.nombre ?? '',
            tipo: item.tipo ?? 'ALIMENTO',
            cantidadActual: item.cantidadActual ?? '',
            stockMinimo: item.stockMinimo ?? '',
            unidad: item.unidad ?? '',
        });

        setEditingId(item.id);
        setShowForm(true);
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !form.nombre.trim()
            || !form.tipo
            || form.cantidadActual === ''
            || form.stockMinimo === ''
            || !form.unidad.trim()
        ) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        if (
            Number(form.cantidadActual) < 0
            || Number(form.stockMinimo) < 0
        ) {
            setError('Las cantidades no pueden ser negativas.');
            return;
        }

        const itemData = {
            nombre: form.nombre.trim(),
            tipo: form.tipo,
            cantidadActual: Number(form.cantidadActual),
            stockMinimo: Number(form.stockMinimo),
            unidad: form.unidad.trim(),
        };

        try {
            setSaving(true);
            setError('');

            if (editingId) {
                await inventoryService.update(editingId, itemData);
            } else {
                await inventoryService.create(itemData);
            }

            resetForm();
            await loadItems();
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible guardar el insumo.',
                ),
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (item) => {
        const confirmed = window.confirm(
            `¿Deseás eliminar el insumo ${item.nombre}?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');
            await inventoryService.remove(item.id);
            await loadItems();
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible eliminar el insumo.',
                ),
            );
        }
    };

    return (
        <>
            <PageHeader
                title="Inventario"
                description="Administración de alimentos, medicinas y otros insumos."
                action={(
                    <button
                        className="primary-button"
                        type="button"
                        onClick={openCreateForm}
                    >
                        <Plus size={19} />
                        Nuevo insumo
                    </button>
                )}
            />

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {showForm && (
                <section className="content-card form-card">
                    <div className="card-heading">
                        <div>
                            <h3>
                                {editingId ? 'Editar insumo' : 'Registrar insumo'}
                            </h3>
                            <p>
                                Indicá la cantidad actual y el límite mínimo.
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
                                <span>Nombre *</span>
                                <input
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: Heno premium"
                                    required
                                />
                            </label>

                            <label className="form-field">
                                <span>Tipo *</span>
                                <select
                                    name="tipo"
                                    value={form.tipo}
                                    onChange={handleChange}
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
                                <span>Cantidad actual *</span>
                                <input
                                    name="cantidadActual"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.cantidadActual}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: 50"
                                    required
                                />
                            </label>

                            <label className="form-field">
                                <span>Stock mínimo *</span>
                                <input
                                    name="stockMinimo"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.stockMinimo}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: 10"
                                    required
                                />
                            </label>

                            <label className="form-field">
                                <span>Unidad *</span>
                                <input
                                    name="unidad"
                                    value={form.unidad}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: kg, litros, unidades"
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
                                {saving ? 'Guardando...' : 'Guardar insumo'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="content-card filters-card">
                <div className="inventory-filters">
                    <label className="form-field">
                        <span>Tipo</span>
                        <select
                            value={typeFilter}
                            onChange={(event) =>
                                setTypeFilter(event.target.value)}
                        >
                            <option value="TODOS">Todos los tipos</option>

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
                                placeholder="Nombre o unidad"
                            />
                        </div>
                    </label>

                    <label className="stock-checkbox">
                        <input
                            type="checkbox"
                            checked={onlyLowStock}
                            onChange={(event) =>
                                setOnlyLowStock(event.target.checked)}
                        />

                        <span>Mostrar solo stock bajo</span>
                    </label>
                </div>
            </section>

            <section className="content-card">
                <div className="feeding-heading">
                    <div>
                        <h3>Insumos registrados</h3>
                        <p>Total: {filteredItems.length}</p>
                    </div>

                    <Boxes size={27} />
                </div>

                {loading ? (
                    <div className="empty-state">
                        Cargando inventario...
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="empty-state">
                        No hay insumos para mostrar.
                    </div>
                ) : (
                    <div className="inventory-grid">
                        {filteredItems.map((item) => {
                            const lowStock =
                                Number(item.cantidadActual)
                                <= Number(item.stockMinimo);

                            return (
                                <article
                                    className={`inventory-card ${
                                        lowStock ? 'inventory-card-low' : ''
                                    }`}
                                    key={item.id}
                                >
                                    <div className="inventory-card-top">
                                        <div>
                      <span className="status-badge">
                        {item.tipo}
                      </span>

                                            <h4>{item.nombre}</h4>
                                        </div>

                                        <div className="table-actions">
                                            <button
                                                className="table-icon-button"
                                                type="button"
                                                onClick={() => openEditForm(item)}
                                                aria-label="Editar insumo"
                                            >
                                                <Pencil size={17} />
                                            </button>

                                            <button
                                                className="table-icon-button danger"
                                                type="button"
                                                onClick={() => handleDelete(item)}
                                                aria-label="Eliminar insumo"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="inventory-quantity">
                                        <strong>{item.cantidadActual}</strong>
                                        <span>{item.unidad}</span>
                                    </div>

                                    <div className="inventory-minimum">
                                        Stock mínimo: {item.stockMinimo} {item.unidad}
                                    </div>

                                    {lowStock && (
                                        <div className="low-stock-warning">
                                            <AlertTriangle size={17} />
                                            Stock bajo
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </>
    );
}

export default InventoryPage;