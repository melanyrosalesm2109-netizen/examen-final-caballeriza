import { useEffect, useState } from 'react';

const initialForm = {
titulo: '',
descripcion: '',
employeeId: '',
fecha: '',
estado: 'PENDIENTE',
};

function TaskForm({
employees,
onSave,
loading,
taskToEdit,
onCancelEdit,
}) {
const [form, setForm] = useState(initialForm);
const [validationError, setValidationError] = useState('');


useEffect(() => {
    if (taskToEdit) {
        setForm({
            titulo: taskToEdit.titulo || '',
            descripcion: taskToEdit.descripcion || '',
            employeeId: taskToEdit.employee?.id || '',
            fecha: taskToEdit.fecha || '',
            estado: taskToEdit.estado || 'PENDIENTE',
        });
    } else {
        setForm(initialForm);
    }

    setValidationError('');
}, [taskToEdit]);

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

    if (!form.titulo.trim()) {
        setValidationError(
            'El título de la tarea es obligatorio.',
        );
        return;
    }

    if (!form.employeeId) {
        setValidationError(
            'Debe seleccionar un empleado.',
        );
        return;
    }

    if (!form.fecha) {
        setValidationError(
            'La fecha es obligatoria.',
        );
        return;
    }

    const task = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        employee: {
            id: Number(form.employeeId),
        },
        fecha: form.fecha,
        estado: form.estado,
    };

    const saved = await onSave(task);

    if (saved && !taskToEdit) {
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
            {taskToEdit
                ? 'Editar tarea'
                : 'Registrar tarea'}
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
                <span>Título</span>

                <input
                    type="text"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                    placeholder="Nombre de la tarea"
                    maxLength="120"
                    style={styles.input}
                    required
                />
            </label>

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
                <span>Estado</span>

                <select
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                    style={styles.input}
                    required
                >
                    <option value="PENDIENTE">
                        Pendiente
                    </option>

                    <option value="EN_PROCESO">
                        En proceso
                    </option>

                    <option value="COMPLETADA">
                        Completada
                    </option>

                    <option value="CANCELADA">
                        Cancelada
                    </option>
                </select>
            </label>

            <label style={styles.descriptionField}>
                <span>Descripción</span>

                <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción de la tarea"
                    rows="4"
                    maxLength="500"
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
                        : taskToEdit
                            ? 'Guardar cambios'
                            : 'Registrar tarea'}
                </button>

                {taskToEdit && (
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

descriptionField: {
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

export default TaskForm;
