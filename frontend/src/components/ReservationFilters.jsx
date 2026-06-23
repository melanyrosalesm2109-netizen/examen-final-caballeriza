import { useState } from 'react';

const initialFilters = {
tipo: '',
fecha: '',
estado: '',
};

function ReservationFilters({
onFilter,
onClear,
loading,
}) {
const [filters, setFilters] = useState(initialFilters);


const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
        ...currentFilters,
        [name]: value,
    }));
};

const handleSubmit = (event) => {
    event.preventDefault();
    onFilter(filters);
};

const handleClear = () => {
    setFilters(initialFilters);
    onClear();
};

return (
    <section style={styles.section}>
        <h2 style={styles.title}>
            Filtros de búsqueda
        </h2>

        <form
            onSubmit={handleSubmit}
            style={styles.form}
        >
            <label style={styles.field}>
                <span>Tipo de reserva</span>

                <select
                    name="tipo"
                    value={filters.tipo}
                    onChange={handleChange}
                    style={styles.input}
                >
                    <option value="">
                        Todos
                    </option>

                    <option value="VETERINARIO">
                        Veterinario
                    </option>

                    <option value="MONTA">
                        Monta
                    </option>

                    <option value="PASEO">
                        Paseo
                    </option>

                    <option value="ENTRENAMIENTO">
                        Entrenamiento
                    </option>
                </select>
            </label>

            <label style={styles.field}>
                <span>Fecha</span>

                <input
                    type="date"
                    name="fecha"
                    value={filters.fecha}
                    onChange={handleChange}
                    style={styles.input}
                />
            </label>

            <label style={styles.field}>
                <span>Estado</span>

                <select
                    name="estado"
                    value={filters.estado}
                    onChange={handleChange}
                    style={styles.input}
                >
                    <option value="">
                        Todos
                    </option>

                    <option value="PROGRAMADA">
                        Programada
                    </option>

                    <option value="CANCELADA">
                        Cancelada
                    </option>

                    <option value="COMPLETADA">
                        Completada
                    </option>
                </select>
            </label>

            <div style={styles.actions}>
                <button
                    type="submit"
                    disabled={loading}
                    style={styles.primaryButton}
                >
                    {loading
                        ? 'Filtrando...'
                        : 'Filtrar'}
                </button>

                <button
                    type="button"
                    onClick={handleClear}
                    disabled={loading}
                    style={styles.secondaryButton}
                >
                    Limpiar
                </button>
            </div>
        </form>
    </section>
);

}

const styles = {
section: {
marginTop: '30px',
marginBottom: '30px',
paddingTop: '24px',
borderTop: '1px solid #e1e7e4',
},

title: {
    marginTop: 0,
    marginBottom: '18px',
    fontSize: '20px',
},

form: {
    display: 'grid',
    gridTemplateColumns:
        'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '16px',
    alignItems: 'end',
},

field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
    fontWeight: 600,
},

input: {
    width: '100%',
    padding: '11px 12px',
    border: '1px solid #d4ddd8',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    font: 'inherit',
},

actions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
},

primaryButton: {
    padding: '11px 18px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#164c3d',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer',
},

secondaryButton: {
    padding: '11px 18px',
    border: '1px solid #b8c6c0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#183a31',
    fontWeight: 700,
    cursor: 'pointer',
},


};

export default ReservationFilters;
