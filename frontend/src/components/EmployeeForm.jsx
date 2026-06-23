import { useEffect, useState } from 'react';

const initialForm = {
nombre: '',
rol: 'VETERINARIO',
contacto: '',
};

function EmployeeForm({
onSave,
loading,
employeeToEdit,
onCancelEdit,
}) {
const [form, setForm] = useState(initialForm);


useEffect(() => {
    if (employeeToEdit) {
        setForm({
            nombre: employeeToEdit.nombre || '',
            rol: employeeToEdit.rol || 'VETERINARIO',
            contacto: employeeToEdit.contacto || '',
        });
    } else {
        setForm(initialForm);
    }
}, [employeeToEdit]);

const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
        ...currentForm,
        [name]: value,
    }));
};

const handleSubmit = async (event) => {
    event.preventDefault();

    const employee = {
        nombre: form.nombre.trim(),
        rol: form.rol,
        contacto: form.contacto.trim(),
    };

    const saved = await onSave(employee);

    if (saved && !employeeToEdit) {
        setForm(initialForm);
    }
};

const handleCancel = () => {
    setForm(initialForm);
    onCancelEdit();
};

return (
    <section style={styles.section}>
        <h2 style={styles.title}>
            {employeeToEdit
                ? 'Editar empleado'
                : 'Registrar empleado'}
        </h2>

        <form
            onSubmit={handleSubmit}
            style={styles.form}
        >
            <label style={styles.field}>
                <span>Nombre</span>

                <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                    style={styles.input}
                    required
                />
            </label>

            <label style={styles.field}>
                <span>Rol</span>

                <select
                    name="rol"
                    value={form.rol}
                    onChange={handleChange}
                    style={styles.input}
                    required
                >
                    <option value="VETERINARIO">
                        Veterinario
                    </option>

                    <option value="POTRADOR">
                        Potrador
                    </option>

                    <option value="CUIDADOR">
                        Cuidador
                    </option>

                    <option value="ADMINISTRADOR">
                        Administrador
                    </option>
                </select>
            </label>

            <label style={styles.field}>
                <span>Contacto</span>

                <input
                    type="text"
                    name="contacto"
                    value={form.contacto}
                    onChange={handleChange}
                    placeholder="Teléfono o correo"
                    style={styles.input}
                    required
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
                        : employeeToEdit
                            ? 'Guardar cambios'
                            : 'Registrar empleado'}
                </button>

                {employeeToEdit && (
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

export default EmployeeForm;
