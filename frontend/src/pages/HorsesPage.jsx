import {
    Image,
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

const initialForm = {
    nombre: '',
    identificador: '',
    edad: '',
    raza: '',
    sexo: 'MACHO',
    peso: '',
    fotoUrl: '',
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

function HorsesPage() {
    const [horses, setHorses] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const filteredHorses = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) {
            return horses;
        }

        return horses.filter((horse) =>
            [
                horse.nombre,
                horse.identificador,
                horse.raza,
                horse.sexo,
            ]
                .filter(Boolean)
                .some((field) =>
                    String(field).toLowerCase().includes(value),
                ),
        );
    }, [horses, search]);

    const loadHorses = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await horseService.getAll();
            setHorses(Array.isArray(data) ? data : []);
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible cargar los caballos.',
                ),
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHorses();
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

    const openEditForm = (horse) => {
        setForm({
            nombre: horse.nombre ?? '',
            identificador: horse.identificador ?? '',
            edad: horse.edad ?? '',
            raza: horse.raza ?? '',
            sexo: horse.sexo ?? 'MACHO',
            peso: horse.peso ?? '',
            fotoUrl: horse.fotoUrl ?? '',
        });

        setEditingId(horse.id);
        setShowForm(true);
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !form.nombre.trim()
            || !form.identificador.trim()
            || !form.raza.trim()
        ) {
            setError(
                'El nombre, el identificador y la raza son obligatorios.',
            );
            return;
        }

        if (
            form.edad === ''
            || form.peso === ''
            || Number(form.edad) < 0
            || Number(form.peso) < 0
        ) {
            setError('La edad y el peso deben ser números válidos.');
            return;
        }

        const horseData = {
            nombre: form.nombre.trim(),
            identificador: form.identificador.trim(),
            edad: Number(form.edad),
            raza: form.raza.trim(),
            sexo: form.sexo,
            peso: Number(form.peso),
            fotoUrl: form.fotoUrl.trim() || null,
        };

        try {
            setSaving(true);
            setError('');

            if (editingId) {
                await horseService.update(editingId, horseData);
            } else {
                await horseService.create(horseData);
            }

            resetForm();
            await loadHorses();
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible guardar el caballo.',
                ),
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (horse) => {
        const confirmed = window.confirm(
            `¿Deseás eliminar a ${horse.nombre}?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');
            await horseService.remove(horse.id);
            await loadHorses();
        } catch (requestError) {
            setError(
                getErrorMessage(
                    requestError,
                    'No fue posible eliminar el caballo.',
                ),
            );
        }
    };

    return (
        <>
            <PageHeader
                title="Gestión de caballos"
                description="Registro, edición y consulta de los caballos de la caballeriza."
                action={(
                    <button
                        className="primary-button"
                        type="button"
                        onClick={openCreateForm}
                    >
                        <Plus size={19} />
                        Nuevo caballo
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
                                {editingId
                                    ? 'Editar caballo'
                                    : 'Registrar caballo'}
                            </h3>

                            <p>
                                Completá los datos solicitados. La fotografía es
                                opcional.
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
                                    placeholder="Ejemplo: Relámpago"
                                    required
                                />
                            </label>

                            <label className="form-field">
                                <span>Identificador *</span>
                                <input
                                    name="identificador"
                                    value={form.identificador}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: CAB-001"
                                    required
                                />
                            </label>

                            <label className="form-field">
                                <span>Edad *</span>
                                <input
                                    name="edad"
                                    type="number"
                                    min="0"
                                    value={form.edad}
                                    onChange={handleChange}
                                    placeholder="Edad en años"
                                    required
                                />
                            </label>

                            <label className="form-field">
                                <span>Raza *</span>
                                <input
                                    name="raza"
                                    value={form.raza}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: Andaluz"
                                    required
                                />
                            </label>

                            <label className="form-field">
                                <span>Sexo *</span>
                                <select
                                    name="sexo"
                                    value={form.sexo}
                                    onChange={handleChange}
                                >
                                    <option value="MACHO">Macho</option>
                                    <option value="HEMBRA">Hembra</option>
                                </select>
                            </label>

                            <label className="form-field">
                                <span>Peso *</span>
                                <input
                                    name="peso"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.peso}
                                    onChange={handleChange}
                                    placeholder="Peso en kilogramos"
                                    required
                                />
                            </label>

                            <label className="form-field">
                                <span>URL de la fotografía</span>
                                <input
                                    name="fotoUrl"
                                    type="url"
                                    value={form.fotoUrl}
                                    onChange={handleChange}
                                    placeholder="https://..."
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
                                {saving ? 'Guardando...' : 'Guardar caballo'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="content-card">
                <div className="table-toolbar">
                    <div>
                        <h3>Caballos registrados</h3>
                        <p>Total: {horses.length}</p>
                    </div>

                    <label className="search-field">
                        <Search size={18} />

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)}
                            placeholder="Buscar por nombre, identificador, raza o sexo"
                        />
                    </label>
                </div>

                {loading ? (
                    <div className="empty-state">
                        Cargando caballos...
                    </div>
                ) : (
                    <div className="data-table-wrapper">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Fotografía</th>
                                <th>Identificador</th>
                                <th>Nombre</th>
                                <th>Edad</th>
                                <th>Raza</th>
                                <th>Sexo</th>
                                <th>Peso</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredHorses.length === 0 ? (
                                <tr>
                                    <td colSpan="8">
                                        <div className="empty-table">
                                            No hay caballos para mostrar.
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredHorses.map((horse) => (
                                    <tr key={horse.id}>
                                        <td>
                                            {horse.fotoUrl ? (
                                                <img
                                                    className="horse-thumbnail"
                                                    src={horse.fotoUrl}
                                                    alt={horse.nombre}
                                                />
                                            ) : (
                                                <div className="image-placeholder">
                                                    <Image size={21} />
                                                </div>
                                            )}
                                        </td>

                                        <td>
                        <span className="status-badge">
                          {horse.identificador}
                        </span>
                                        </td>

                                        <td>
                                            <strong>{horse.nombre}</strong>
                                        </td>

                                        <td>{horse.edad} años</td>
                                        <td>{horse.raza}</td>

                                        <td>
                        <span className="status-badge">
                          {horse.sexo}
                        </span>
                                        </td>

                                        <td>{horse.peso} kg</td>

                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    className="table-icon-button"
                                                    type="button"
                                                    onClick={() =>
                                                        openEditForm(horse)}
                                                    aria-label={`Editar ${horse.nombre}`}
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    className="table-icon-button danger"
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(horse)}
                                                    aria-label={`Eliminar ${horse.nombre}`}
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    );
}

export default HorsesPage;