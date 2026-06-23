import { useEffect, useState } from 'react';

const initialForm = {
    employeeId: '',
    titulo: '',
    descripcion: '',
    fechaAsignacion: '',
    fechaLimite: '',
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

    useEffect(() => {
        if (!taskToEdit) {
            setForm(initialForm);
            return;
        }

        setForm({
            employeeId: taskToEdit.employee?.id ?? '',
            titulo: taskToEdit.titulo ?? '',
            descripcion: taskToEdit.descripcion ?? '',
            fechaAsignacion:
                taskToEdit.fechaAsignacion ?? '',
            fechaLimite:
                taskToEdit.fechaLimite ?? '',
            estado:
                taskToEdit.estado ?? 'PENDIENTE',
        });
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

        if (!form.employeeId) {
            return;
        }

        const task = {
            employee: {
                id: Number(form.employeeId),
            },
            titulo: form.titulo.trim(),
            descripcion: form.descripcion.trim(),
            fechaAsignacion: form.fechaAsignacion,
            fechaLimite: form.fechaLimite || null,
            estado: form.estado,
        };

        const saved = await onSave(task);

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
                    {taskToEdit
                        ? `Editar tarea #${taskToEdit.id}`
                        : 'Registrar tarea'}
                </h2>

                {taskToEdit && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                        style={styles.secondaryButton}
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
                    <span>Título</span>

                    <input
                        type="text"
                        name="titulo"
                        value={form.titulo}
                        onChange={handleChange}
                        placeholder="Ejemplo: Limpieza de establo"
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
                    <span>Fecha de asignación</span>

                    <input
                        type="date"
                        name="fechaAsignacion"
                        value={form.fechaAsignacion}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </label>

                <label style={styles.field}>
                    <span>Fecha límite</span>

                    <input
                        type="date"
                        name="fechaLimite"
                        value={form.fechaLimite}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </label>

                <label style={styles.field}>
                    <span>Estado</span>

                    <select
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                        style={styles.input}
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
                        style={styles.input}
                    />
                </label>

                <div style={styles.actions}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.primaryButton,
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading
                            ? 'Guardando...'
                            : taskToEdit
                                ? 'Guardar cambios'
                                : 'Registrar tarea'}
                    </button>
                </div>
            </form>
        </section>
    );
}

const styles = {
    section: {
        marginBottom: '28px',
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        gridColumn: '1 / -1',
    },

    primaryButton: {
        padding: '11px 17px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#164c3d',
        color: '#ffffff',
        fontWeight: 700,
        cursor: 'pointer',
    },

    secondaryButton: {
        padding: '9px 14px',
        border: '1px solid #b8c6c0',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        color: '#183a31',
        fontWeight: 700,
        cursor: 'pointer',
    },
};

export default TaskForm;