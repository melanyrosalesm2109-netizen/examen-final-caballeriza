import { useEffect, useState } from 'react';

import ModulePage from '../components/ModulePage';
import ShiftForm from '../components/ShiftForm';

import {
getEmployees,
} from '../services/employeeService';

import {
createShift,
deleteShift,
getShifts,
getShiftsByEmployee,
updateShift,
} from '../services/shiftService';

function ShiftsPage() {
const [shifts, setShifts] = useState([]);
const [employees, setEmployees] = useState([]);
const [shiftToEdit, setShiftToEdit] = useState(null);
const [selectedEmployeeId, setSelectedEmployeeId] =
useState('');


const [loadingList, setLoadingList] = useState(false);
const [loadingEmployees, setLoadingEmployees] =
    useState(false);
const [saving, setSaving] = useState(false);
const [filtering, setFiltering] = useState(false);
const [deletingId, setDeletingId] = useState(null);

const [message, setMessage] = useState('');
const [error, setError] = useState('');

const loadEmployees = async () => {
    try {
        setLoadingEmployees(true);

        const data = await getEmployees();

        setEmployees(
            Array.isArray(data) ? data : [],
        );
    } catch {
        setEmployees([]);

        setError(
            'No se pudieron cargar los empleados.',
        );
    } finally {
        setLoadingEmployees(false);
    }
};

const loadShifts = async () => {
    try {
        setLoadingList(true);
        setError('');

        const data = await getShifts();

        setShifts(
            Array.isArray(data) ? data : [],
        );
    } catch {
        setShifts([]);

        setError(
            'No se pudo conectar con el backend para cargar los turnos.',
        );
    } finally {
        setLoadingList(false);
    }
};

useEffect(() => {
    loadEmployees();
    loadShifts();
}, []);

const handleSave = async (shift) => {
    try {
        setSaving(true);
        setMessage('');
        setError('');

        if (shiftToEdit) {
            await updateShift(
                shiftToEdit.id,
                shift,
            );

            setMessage(
                'Turno actualizado correctamente.',
            );
        } else {
            await createShift(shift);

            setMessage(
                'Turno registrado correctamente.',
            );
        }

        setShiftToEdit(null);
        setSelectedEmployeeId('');

        await loadShifts();

        return true;
    } catch (requestError) {
        const backendMessage =
            requestError.response?.data?.message ||
            requestError.response?.data?.error ||
            requestError.response?.data;

        setError(
            typeof backendMessage === 'string'
                ? backendMessage
                : 'No se pudo guardar el turno.',
        );

        return false;
    } finally {
        setSaving(false);
    }
};

const handleEdit = (shift) => {
    setShiftToEdit(shift);
    setMessage('');
    setError('');

    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

const handleCancelEdit = () => {
    setShiftToEdit(null);
    setMessage('');
    setError('');
};

const handleDelete = async (shift) => {
    const employeeName =
        shift.employee?.nombre ||
        'este empleado';

    const confirmed = window.confirm(
        `¿Deseas eliminar el turno de ${employeeName}?`,
    );

    if (!confirmed) {
        return;
    }

    try {
        setDeletingId(shift.id);
        setMessage('');
        setError('');

        await deleteShift(shift.id);

        if (shiftToEdit?.id === shift.id) {
            setShiftToEdit(null);
        }

        setMessage(
            'Turno eliminado correctamente.',
        );

        await loadShifts();
    } catch {
        setError(
            'No se pudo eliminar el turno.',
        );
    } finally {
        setDeletingId(null);
    }
};

const handleFilter = async (event) => {
    event.preventDefault();

    if (!selectedEmployeeId) {
        await loadShifts();
        return;
    }

    try {
        setFiltering(true);
        setMessage('');
        setError('');

        const data = await getShiftsByEmployee(
            selectedEmployeeId,
        );

        setShifts(
            Array.isArray(data) ? data : [],
        );
    } catch {
        setShifts([]);

        setError(
            'No se pudieron filtrar los turnos por empleado.',
        );
    } finally {
        setFiltering(false);
    }
};

const handleClearFilter = async () => {
    setSelectedEmployeeId('');
    setMessage('');
    setError('');

    await loadShifts();
};

return (
    <ModulePage
        title="Gestión de turnos"
        description="Registro, consulta y organización de los turnos de trabajo."
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

        <ShiftForm
            employees={employees}
            onSave={handleSave}
            loading={saving}
            shiftToEdit={shiftToEdit}
            onCancelEdit={handleCancelEdit}
        />

        <section style={styles.filterSection}>
            <h2 style={styles.title}>
                Filtrar por empleado
            </h2>

            <form
                onSubmit={handleFilter}
                style={styles.filterForm}
            >
                <label style={styles.field}>
                    <span>Empleado</span>

                    <select
                        value={selectedEmployeeId}
                        onChange={(event) =>
                            setSelectedEmployeeId(
                                event.target.value,
                            )
                        }
                        style={styles.input}
                        disabled={loadingEmployees}
                    >
                        <option value="">
                            Todos los empleados
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

                <div style={styles.filterActions}>
                    <button
                        type="submit"
                        disabled={filtering}
                        style={styles.primaryButton}
                    >
                        {filtering
                            ? 'Filtrando...'
                            : 'Filtrar'}
                    </button>

                    <button
                        type="button"
                        onClick={handleClearFilter}
                        disabled={filtering}
                        style={styles.secondaryButton}
                    >
                        Limpiar
                    </button>
                </div>
            </form>
        </section>

        <div style={styles.header}>
            <h2 style={styles.title}>
                Turnos registrados
            </h2>

            <button
                type="button"
                onClick={loadShifts}
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
            <p>Cargando turnos...</p>
        )}

        {!loadingList && shifts.length === 0 && (
            <div className="empty-state">
                No existen turnos para mostrar.
            </div>
        )}

        {!loadingList && shifts.length > 0 && (
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.cell}>
                                ID
                            </th>

                            <th style={styles.cell}>
                                Empleado
                            </th>

                            <th style={styles.cell}>
                                Fecha
                            </th>

                            <th style={styles.cell}>
                                Hora de inicio
                            </th>

                            <th style={styles.cell}>
                                Hora final
                            </th>

                            <th style={styles.cell}>
                                Observaciones
                            </th>

                            <th style={styles.cell}>
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {shifts.map((shift) => (
                            <tr key={shift.id}>
                                <td style={styles.cell}>
                                    {shift.id}
                                </td>

                                <td style={styles.cell}>
                                    {shift.employee?.nombre ||
                                        shift.employee?.id ||
                                        'Sin empleado'}
                                </td>

                                <td style={styles.cell}>
                                    {shift.fecha || '-'}
                                </td>

                                <td style={styles.cell}>
                                    {shift.horaInicio?.slice(
                                        0,
                                        5,
                                    ) || '-'}
                                </td>

                                <td style={styles.cell}>
                                    {shift.horaFin?.slice(
                                        0,
                                        5,
                                    ) || '-'}
                                </td>

                                <td style={styles.cell}>
                                    {shift.observaciones ||
                                        'Sin observaciones'}
                                </td>

                                <td style={styles.cell}>
                                    <div style={styles.actions}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(shift)
                                            }
                                            disabled={
                                                deletingId ===
                                                shift.id
                                            }
                                            style={styles.editButton}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(shift)
                                            }
                                            disabled={
                                                deletingId ===
                                                shift.id
                                            }
                                            style={styles.deleteButton}
                                        >
                                            {deletingId === shift.id
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

filterSection: {
    marginTop: '30px',
    marginBottom: '30px',
    paddingTop: '24px',
    borderTop: '1px solid #e1e7e4',
},

filterForm: {
    display: 'flex',
    alignItems: 'end',
    gap: '16px',
    flexWrap: 'wrap',
},

field: {
    display: 'flex',
    minWidth: '240px',
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

filterActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
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

secondaryButton: {
    padding: '10px 16px',
    border: '1px solid #b8c6c0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#183a31',
    fontWeight: 700,
    cursor: 'pointer',
},

tableContainer: {
    width: '100%',
    overflowX: 'auto',
},

table: {
    width: '100%',
    minWidth: '950px',
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

export default ShiftsPage;
