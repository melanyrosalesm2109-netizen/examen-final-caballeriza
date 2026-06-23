import { useEffect, useState } from 'react';

import EmployeeForm from '../components/EmployeeForm';
import ModulePage from '../components/ModulePage';
import {
    createEmployee,
    deleteEmployee,
    getEmployees,
    updateEmployee,
} from '../services/employeeService';

function EmployeesPage() {
const [employees, setEmployees] = useState([]);
const [employeeToEdit, setEmployeeToEdit] = useState(null);
const [loadingList, setLoadingList] = useState(false);
const [saving, setSaving] = useState(false);
const [deletingId, setDeletingId] = useState(null);
const [message, setMessage] = useState('');
const [error, setError] = useState('');

const loadEmployees = async () => {
    try {
        setLoadingList(true);
        setError('');

        const data = await getEmployees();

        setEmployees(
            Array.isArray(data) ? data : [],
        );
    } catch {
        setEmployees([]);

        setError(
            'No se pudo conectar con el backend para cargar los empleados.',
        );
    } finally {
        setLoadingList(false);
    }
};

useEffect(() => {
    loadEmployees();
}, []);

const handleSave = async (employee) => {
    try {
        setSaving(true);
        setMessage('');
        setError('');

        if (employeeToEdit) {
            await updateEmployee(
                employeeToEdit.id,
                employee,
            );

            setMessage(
                'Empleado actualizado correctamente.',
            );
        } else {
            await createEmployee(employee);

            setMessage(
                'Empleado registrado correctamente.',
            );
        }

        setEmployeeToEdit(null);
        await loadEmployees();

        return true;
    } catch {
        setError(
            'No se pudo guardar el empleado.',
        );

        return false;
    } finally {
        setSaving(false);
    }
};

const handleEdit = (employee) => {
    setEmployeeToEdit(employee);
    setMessage('');
    setError('');

    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

const handleCancelEdit = () => {
    setEmployeeToEdit(null);
    setMessage('');
    setError('');
};

const handleDelete = async (employee) => {
    const confirmed = window.confirm(
        `¿Deseas eliminar al empleado ${employee.nombre}?`,
    );

    if (!confirmed) {
        return;
    }

    try {
        setDeletingId(employee.id);
        setMessage('');
        setError('');

        await deleteEmployee(employee.id);

        if (employeeToEdit?.id === employee.id) {
            setEmployeeToEdit(null);
        }

        setMessage(
            'Empleado eliminado correctamente.',
        );

        await loadEmployees();
    } catch {
        setError(
            'No se pudo eliminar el empleado.',
        );
    } finally {
        setDeletingId(null);
    }
};

const formatRole = (role) => {
    if (!role) {
        return '-';
    }

    return role
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(
            /\b\w/g,
            (letter) => letter.toUpperCase(),
        );
};

return (
    <ModulePage
        title="Gestión de empleados"
        description="Registro, consulta, edición y eliminación de empleados."
    >
        {message && (
            <div style={styles.success}>
                {message}
            </div>
        )}

        {error && (
            <div style={styles.error}>
                {error}
            </div>
        )}

        <EmployeeForm
            onSave={handleSave}
            loading={saving}
            employeeToEdit={employeeToEdit}
            onCancelEdit={handleCancelEdit}
        />

        <div style={styles.header}>
            <h2 style={styles.title}>
                Empleados registrados
            </h2>

            <button
                type="button"
                onClick={loadEmployees}
                disabled={loadingList}
                style={{
                    ...styles.primaryButton,
                    opacity: loadingList ? 0.7 : 1,
                }}
            >
                {loadingList
                    ? 'Cargando...'
                    : 'Actualizar'}
            </button>
        </div>

        {loadingList && (
            <p>Cargando empleados...</p>
        )}

        {!loadingList && employees.length === 0 && (
            <div className="empty-state">
                No existen empleados para mostrar.
            </div>
        )}

        {!loadingList && employees.length > 0 && (
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.cell}>ID</th>
                            <th style={styles.cell}>Nombre</th>
                            <th style={styles.cell}>Rol</th>
                            <th style={styles.cell}>Contacto</th>
                            <th style={styles.cell}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.id}>
                                <td style={styles.cell}>
                                    {employee.id}
                                </td>

                                <td style={styles.cell}>
                                    {employee.nombre || '-'}
                                </td>

                                <td style={styles.cell}>
                                    {formatRole(employee.rol)}
                                </td>

                                <td style={styles.cell}>
                                    {employee.contacto || '-'}
                                </td>

                                <td style={styles.cell}>
                                    <div style={styles.actions}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(employee)
                                            }
                                            disabled={
                                                deletingId === employee.id
                                            }
                                            style={styles.editButton}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(employee)
                                            }
                                            disabled={
                                                deletingId === employee.id
                                            }
                                            style={styles.deleteButton}
                                        >
                                            {deletingId === employee.id
                                                ? 'Eliminando...'
                                                : 'Eliminar'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </ModulePage>
);


}

const styles = {
success: {
padding: '12px',
marginBottom: '18px',
borderRadius: '8px',
backgroundColor: '#e4f6eb',
color: '#176438',
},


error: {
    padding: '12px',
    marginBottom: '18px',
    borderRadius: '8px',
    backgroundColor: '#fde8e8',
    color: '#a22d2d',
},

header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginTop: '28px',
    marginBottom: '20px',
    flexWrap: 'wrap',
},

title: {
    margin: 0,
    fontSize: '20px',
},

primaryButton: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#164c3d',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer',
},

tableContainer: {
    width: '100%',
    overflowX: 'auto',
},

table: {
    width: '100%',
    minWidth: '700px',
    borderCollapse: 'collapse',
},

cell: {
    padding: '12px',
    borderBottom: '1px solid #e1e7e4',
    textAlign: 'left',
    verticalAlign: 'middle',
},

actions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
},

editButton: {
    padding: '8px 12px',
    border: '1px solid #b8c6c0',
    borderRadius: '7px',
    backgroundColor: '#ffffff',
    color: '#183a31',
    fontWeight: 600,
    cursor: 'pointer',
},

deleteButton: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '7px',
    backgroundColor: '#b84040',
    color: '#ffffff',
    fontWeight: 600,
    cursor: 'pointer',
},


};

export default EmployeesPage;
