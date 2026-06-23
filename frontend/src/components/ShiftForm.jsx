import { useEffect, useState } from 'react';

const initialForm = {
employeeId: '',
fecha: '',
horaInicio: '',
horaFin: '',
observaciones: '',
};

function ShiftForm({
employees,
onSave,
loading,
shiftToEdit,
onCancelEdit,
}) {
const [form, setForm] = useState(initialForm);
const [validationError, setValidationError] = useState('');

useEffect(() => {
    if (shiftToEdit) {
        setForm({
            employeeId: shiftToEdit.employee?.id || '',
            fecha: shiftToEdit.fecha || '',
            horaInicio:
                shiftToEdit.horaInicio?.slice(0, 5) || '',
            horaFin:
                shiftToEdit.horaFin?.slice(0, 5) || '',
            observaciones:
                shiftToEdit.observaciones || '',
        });
    } else {
        setForm(initialForm);
    }

    setValidationError('');
}, [shiftToEdit]);

const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
        ...currentForm,
        [name]: value,
    }));
};

const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError('');

    if (!form.employeeId) {
        setValidationError(
            'Debe seleccionar un empleado.',
        );
        return;
    }

    if (form.horaFin <= form.horaInicio) {
        setValidationError(
            'La hora final debe ser posterior a la hora de inicio.',
        );
        return;
    }

    const shift = {
        employee: {
            id: Number(form.employeeId),
        },
        fecha: form.fecha,
        horaInicio: form.horaInicio,
        horaFin: form.horaFin,
        observaciones: form.observaciones.trim(),
    };

    const saved = await onSave(shift);

    if (saved && !shiftToEdit) {
        setForm(initialForm);
    }
};

const handleCancel = () => {
    setForm(initialForm);
    setValidationError('');
    onCancelEdit();
};

return (
    <section style={styles.section}>
        <h2 style={styles.title}>
            {shiftToEdit
                ? 'Editar turno'
                : 'Registrar turno'}
        </h2>

        {validationError && (
            <div style={styles.error}>
                {validationError}
            </div>
        )}

        <form
            onSubmit={handleSubmit}
            style={styles.form}
        >
            <label style={styles.field}>
                <span>Empleado</span>

                <select
                    name="employeeId"
                    value={form.employeeId}
                    onChange={handleChange}
                    style={styles.input}
                    required
                >
                    <option value="">
                        Seleccione un empleado
                    </option>

                    {employees.map((employee) => (
                        <option
                            key={employee.id}
                            value={employee.id}
                        >
                            {employee.nombre}
                        </option>
                    ))}
                </select>
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
                <span>Hora de inicio</span>

                <input
                    type="time"
                    name="horaInicio"
                    value={form.horaInicio}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </label>

            <label style={styles.field}>
                <span>Hora final</span>

                <input
                    type="time"
                    name="horaFin"
                    value={form.horaFin}
                    onChange={handleChange}
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
                    style={styles.primaryButton}
                >
                    {loading
                        ? 'Guardando...'
                        : shiftToEdit
                            ? 'Guardar cambios'
                            : 'Registrar turno'}
                </button>

                {shiftToEdit && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        style={styles.secondaryButton}
                    >
                        Cancelar edición
                    </button>
                )}
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

error: {
    padding: '12px',
    marginBottom: '18px',
    borderRadius: '8px',
    backgroundColor: '#fde8e8',
    color: '#a22d2d',
},

form: {
    display: 'grid',
    gridTemplateColumns:
        'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '16px',
    alignItems: 'end',
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
    gridColumn: '1 / -1',
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
    gridColumn: '1 / -1',
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

export default ShiftForm;
