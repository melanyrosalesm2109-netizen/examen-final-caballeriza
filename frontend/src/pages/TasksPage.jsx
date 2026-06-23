import { useEffect, useState } from 'react';

import ModulePage from '../components/ModulePage';
import TaskForm from '../components/TaskForm';

import {
getEmployees,
} from '../services/employeeService';

import {
changeTaskStatus,
createTask,
deleteTask,
filterTasks,
getTasks,
updateTask,
} from '../services/taskService';

const initialFilters = {
employeeId: '',
estado: '',
fecha: '',
};

function TasksPage() {
const [tasks, setTasks] = useState([]);
const [employees, setEmployees] = useState([]);
const [taskToEdit, setTaskToEdit] = useState(null);
const [filters, setFilters] = useState(initialFilters);


const [loadingList, setLoadingList] = useState(false);
const [loadingEmployees, setLoadingEmployees] = useState(false);
const [saving, setSaving] = useState(false);
const [filtering, setFiltering] = useState(false);
const [deletingId, setDeletingId] = useState(null);
const [changingStatusId, setChangingStatusId] = useState(null);

const [message, setMessage] = useState('');
const [error, setError] = useState('');

const getBackendMessage = (
    requestError,
    defaultMessage,
) => {
    const backendMessage =
        requestError.response?.data?.message ||
        requestError.response?.data?.error ||
        requestError.response?.data;

    return typeof backendMessage === 'string'
        ? backendMessage
        : defaultMessage;
};

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

const loadTasks = async () => {
    try {
        setLoadingList(true);
        setError('');

        const data = await getTasks();

        setTasks(
            Array.isArray(data) ? data : [],
        );
    } catch {
        setTasks([]);

        setError(
            'No se pudo conectar con el backend para cargar las tareas.',
        );
    } finally {
        setLoadingList(false);
    }
};

useEffect(() => {
    loadEmployees();
    loadTasks();
}, []);

const handleSave = async (task) => {
    try {
        setSaving(true);
        setMessage('');
        setError('');

        if (taskToEdit) {
            await updateTask(
                taskToEdit.id,
                task,
            );

            setMessage(
                'Tarea actualizada correctamente.',
            );
        } else {
            await createTask(task);

            setMessage(
                'Tarea registrada correctamente.',
            );
        }

        setTaskToEdit(null);
        await loadTasks();

        return true;
    } catch (requestError) {
        setError(
            getBackendMessage(
                requestError,
                'No se pudo guardar la tarea.',
            ),
        );

        return false;
    } finally {
        setSaving(false);
    }
};

const handleEdit = (task) => {
    setTaskToEdit(task);
    setMessage('');
    setError('');

    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

const handleCancelEdit = () => {
    setTaskToEdit(null);
    setMessage('');
    setError('');
};

const handleDelete = async (task) => {
    const confirmed = window.confirm(
        `¿Deseas eliminar la tarea "${task.titulo}"?`,
    );

    if (!confirmed) {
        return;
    }

    try {
        setDeletingId(task.id);
        setMessage('');
        setError('');

        await deleteTask(task.id);

        if (taskToEdit?.id === task.id) {
            setTaskToEdit(null);
        }

        setMessage(
            'Tarea eliminada correctamente.',
        );

        await loadTasks();
    } catch (requestError) {
        setError(
            getBackendMessage(
                requestError,
                'No se pudo eliminar la tarea.',
            ),
        );
    } finally {
        setDeletingId(null);
    }
};

const handleStatusChange = async (
    task,
    estado,
) => {
    try {
        setChangingStatusId(task.id);
        setMessage('');
        setError('');

        await changeTaskStatus(
            task.id,
            estado,
        );

        setMessage(
            'Estado de la tarea actualizado correctamente.',
        );

        await loadTasks();
    } catch (requestError) {
        setError(
            getBackendMessage(
                requestError,
                'No se pudo cambiar el estado de la tarea.',
            ),
        );
    } finally {
        setChangingStatusId(null);
    }
};

const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
        ...currentFilters,
        [name]: value,
    }));
};

const handleFilter = async (event) => {
    event.preventDefault();

    try {
        setFiltering(true);
        setMessage('');
        setError('');

        const data = await filterTasks(filters);

        setTasks(
            Array.isArray(data) ? data : [],
        );
    } catch (requestError) {
        setTasks([]);

        setError(
            getBackendMessage(
                requestError,
                'No se pudieron aplicar los filtros.',
            ),
        );
    } finally {
        setFiltering(false);
    }
};

const handleClearFilters = async () => {
    setFilters(initialFilters);
    setMessage('');
    setError('');

    await loadTasks();
};

const formatText = (value) => {
    if (!value) {
        return '-';
    }

    return value
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(
            /\b\w/g,
            (letter) => letter.toUpperCase(),
        );
};

return (
    <ModulePage
        title="Gestión de tareas"
        description="Registro, asignación y seguimiento de tareas de los empleados."
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

        <TaskForm
            employees={employees}
            onSave={handleSave}
            loading={saving}
            taskToEdit={taskToEdit}
            onCancelEdit={handleCancelEdit}
        />

        <section style={styles.filterSection}>
            <h2 style={styles.title}>
                Filtros de búsqueda
            </h2>

            <form
                onSubmit={handleFilter}
                style={styles.filterForm}
            >
                <label style={styles.field}>
                    <span>Empleado</span>

                    <select
                        name="employeeId"
                        value={filters.employeeId}
                        onChange={handleFilterChange}
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

                <label style={styles.field}>
                    <span>Estado</span>

                    <select
                        name="estado"
                        value={filters.estado}
                        onChange={handleFilterChange}
                        style={styles.input}
                    >
                        <option value="">
                            Todos los estados
                        </option>

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

                <label style={styles.field}>
                    <span>Fecha</span>

                    <input
                        type="date"
                        name="fecha"
                        value={filters.fecha}
                        onChange={handleFilterChange}
                        style={styles.input}
                    />
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
                        onClick={handleClearFilters}
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
                Tareas registradas
            </h2>

            <button
                type="button"
                onClick={loadTasks}
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
            <p>Cargando tareas...</p>
        )}

        {!loadingList && tasks.length === 0 && (
            <div className="empty-state">
                No existen tareas para mostrar.
            </div>
        )}

        {!loadingList && tasks.length > 0 && (
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.cell}>ID</th>
                            <th style={styles.cell}>Título</th>
                            <th style={styles.cell}>Empleado</th>
                            <th style={styles.cell}>Fecha</th>
                            <th style={styles.cell}>Estado</th>
                            <th style={styles.cell}>Descripción</th>
                            <th style={styles.cell}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td style={styles.cell}>
                                    {task.id}
                                </td>

                                <td style={styles.cell}>
                                    {task.titulo || '-'}
                                </td>

                                <td style={styles.cell}>
                                    {task.employee?.nombre ||
                                        task.employee?.id ||
                                        'Sin empleado'}
                                </td>

                                <td style={styles.cell}>
                                    {task.fecha || '-'}
                                </td>

                                <td style={styles.cell}>
                                    <select
                                        value={
                                            task.estado ||
                                            'PENDIENTE'
                                        }
                                        onChange={(event) =>
                                            handleStatusChange(
                                                task,
                                                event.target.value,
                                            )
                                        }
                                        disabled={
                                            changingStatusId ===
                                            task.id
                                        }
                                        style={styles.statusSelect}
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

                                    <small style={styles.statusText}>
                                        {formatText(task.estado)}
                                    </small>
                                </td>

                                <td style={styles.cell}>
                                    {task.descripcion ||
                                        'Sin descripción'}
                                </td>

                                <td style={styles.cell}>
                                    <div style={styles.actions}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(task)
                                            }
                                            disabled={
                                                deletingId === task.id
                                            }
                                            style={styles.editButton}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(task)
                                            }
                                            disabled={
                                                deletingId === task.id
                                            }
                                            style={styles.deleteButton}
                                        >
                                            {deletingId === task.id
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
    minWidth: '1050px',
    borderCollapse: 'collapse',
},

cell: {
    padding: '12px',
    borderBottom: '1px solid #e1e7e4',
    textAlign: 'left',
    verticalAlign: 'middle',
},

statusSelect: {
    minWidth: '130px',
    padding: '7px',
    border: '1px solid #d4ddd8',
    borderRadius: '7px',
    backgroundColor: '#ffffff',
},

statusText: {
    display: 'block',
    marginTop: '5px',
    color: '#5d6d66',
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

export default TasksPage;
