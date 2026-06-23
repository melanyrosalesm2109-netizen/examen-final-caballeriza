import { useEffect, useState } from 'react';

const initialForm = {
  tipo: 'VETERINARIO',
  horseId: '',
  fecha: '',
  hora: '',
  cliente: '',
  observaciones: '',
  cupoMaximo: 1,
};

function ReservationForm({
  onSave,
  loading,
  reservationToEdit,
  onCancelEdit,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!reservationToEdit) {
      setForm(initialForm);
      return;
    }

    setForm({
      tipo: reservationToEdit.tipo ?? 'VETERINARIO',
      horseId: reservationToEdit.horse?.id ?? '',
      fecha: reservationToEdit.fecha ?? '',
      hora: reservationToEdit.hora?.slice(0, 5) ?? '',
      cliente: reservationToEdit.cliente ?? '',
      observaciones:
        reservationToEdit.observaciones ?? '',
      cupoMaximo:
        reservationToEdit.cupoMaximo ?? 1,
    });
  }, [reservationToEdit]);

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
      estado:
        reservationToEdit?.estado ?? 'PROGRAMADA',
      observaciones: form.observaciones.trim(),
      cupoMaximo: Number(form.cupoMaximo),
      cuposReservados:
        reservationToEdit?.cuposReservados ?? 0,
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

  const handleCancelEdit = () => {
    setForm(initialForm);

    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          {reservationToEdit
            ? `Editar reserva #${reservationToEdit.id}`
            : 'Registrar reserva'}
        </h2>

        {reservationToEdit && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={styles.cancelEditButton}
          >
            Cancelar edición
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >
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
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading
                ? 'not-allowed'
                : 'pointer',
            }}
          >
            {loading
              ? 'Guardando...'
              : reservationToEdit
                ? 'Guardar cambios'
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

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '18px',
    flexWrap: 'wrap',
  },

  title: {
    margin: 0,
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
  },

  cancelEditButton: {
    padding: '9px 14px',
    border: '1px solid #b8c6c0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#183a31',
    fontWeight: 700,
    cursor: 'pointer',
  },
};

export default ReservationForm;

