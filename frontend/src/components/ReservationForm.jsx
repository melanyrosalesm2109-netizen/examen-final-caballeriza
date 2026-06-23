
import { useState } from 'react';

const initialForm = {
    tipo: 'VETERINARIO',
    horseId: '',
    fecha: '',
    hora: '',
    cliente: '',
    observaciones: '',
    cupoMaximo: 1,
};

function ReservationForm({ onSave, loading }) {
    const [form, setForm] = useState(initialForm);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const reservation = {
            tipo: form.tipo,
            fecha: form.fecha,
            hora: form.hora,
            cliente: form.cliente.trim(),
            estado: 'PROGRAMADA',
            observaciones: form.observaciones.trim(),
            cupoMaximo: Number(form.cupoMaximo),
            cuposReservados: 0,
        };

        if (form.horseId) {
            reservation.horse = {
                id: Number(form.horseId),
            };
        }

        const saved = await onSave(reservation);

        if (saved) {
            setForm(initialForm);
        }
    };

    return (
        <section style={styles.section}>
            <h2 style={styles.title}>Registrar reserva</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.field}>
                    <span>Tipo de reserva</span>

                    <select
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        style={styles.input}
                    >
                        <option value="VETERINARIO">
                            Veterinario
                        </option>

                        <option value="MONTA">Monta</option>

                        <option value="PASEO">Paseo</option>

                        <option value="ENTRENAMIENTO">
                            Entrenamiento
                        </option>
                    </select>
                </label>

                <label style={styles.field}>
                    <span>ID del caballo</span>

                    <input
                        type="number"
                        name="horseId"
                        value={form.horseId}
                        onChange={handleChange}
                        min="1"
                        placeholder="Opcional"
                        style={styles.input}
                    />
                </label>

                <label style={styles.field}>
                    <span>Fecha</span>

                    <input
                        type="date"
                        name="fecha"
                        value={form.fecha}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </label>

                <label style={styles.field}>
                    <span>Hora</span>

                    <input
                        type="time"
                        name="hora"
                        value={form.hora}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </label>

                <label style={styles.field}>
                    <span>Cliente o responsable</span>

                    <input
                        type="text"
                        name="cliente"
                        value={form.cliente}
                        onChange={handleChange}
                        placeholder="Nombre completo"
                        style={styles.input}
                        required
                    />
                </label>

                <label style={styles.field}>
                    <span>Cupo máximo</span>

                    <input
                        type="number"
                        name="cupoMaximo"
                        value={form.cupoMaximo}
                        onChange={handleChange}
                        min="1"
                        style={styles.input}
                        required
                    />
                </label>

                <label style={styles.observations}>
                    <span>Observaciones</span>

                    <textarea
                        name="observaciones"
                        value={form.observaciones}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Información adicional"
                        style={styles.input}
                    />
                </label>

                <div style={styles.actions}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading
                            ? 'Guardando...'
                            : 'Registrar reserva'}
                    </button>
                </div>
            </form>
        </section>
    );
}

const styles = {
    section: {
        marginBottom: '30px',
    },

    title: {
        marginTop: 0,
        marginBottom: '18px',
        fontSize: '20px',
    },

    form: {
        display: 'grid',
        gridTemplateColumns:
            'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
    },

    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '7px',
        fontWeight: 600,
    },

    observations: {
        display: 'flex',
        flexDirection: 'column',
        gap: '7px',
        fontWeight: 600,
        gridColumn: '1 / -1',
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
        gridColumn: '1 / -1',
    },

    button: {
        padding: '11px 18px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#164c3d',
        color: '#ffffff',
        fontWeight: 700,
        cursor: 'pointer',
    },
};

export default ReservationForm;
