import api from './api';

const BASE_PATH = '/tasks';

export const getTasks = async () => {
    const response = await api.get(BASE_PATH);
    return response.data;
};

export const getTaskById = async (id) => {
    const response = await api.get(
        `${BASE_PATH}/${id}`,
    );

    return response.data;
};

export const getTasksByEmployee = async (
    employeeId,
) => {
    const response = await api.get(
        `${BASE_PATH}/employee/${employeeId}`,
    );

    return response.data;
};

export const filterTasks = async ({
                                      employeeId = '',
                                      estado = '',
                                      fecha = '',
                                  }) => {
    const tasks = await getTasks();

    if (!Array.isArray(tasks)) {
        return [];
    }

    return tasks.filter((task) => {
        const matchesEmployee =
            !employeeId
            || String(task.employee?.id)
            === String(employeeId);

        const matchesStatus =
            !estado
            || task.estado === estado;

        const matchesDate =
            !fecha
            || task.fechaAsignacion === fecha;

        return (
            matchesEmployee
            && matchesStatus
            && matchesDate
        );
    });
};

export const createTask = async (task) => {
    const response = await api.post(
        BASE_PATH,
        task,
    );

    return response.data;
};

export const updateTask = async (id, task) => {
    const response = await api.put(
        `${BASE_PATH}/${id}`,
        task,
    );

    return response.data;
};

export const changeTaskStatus = async (
    id,
    estado,
) => {
    const currentTask = await getTaskById(id);

    const taskToUpdate = {
        employee: {
            id: currentTask.employee.id,
        },
        titulo: currentTask.titulo,
        descripcion:
            currentTask.descripcion ?? '',
        fechaAsignacion:
        currentTask.fechaAsignacion,
        fechaLimite:
            currentTask.fechaLimite ?? null,
        estado,
    };

    return updateTask(id, taskToUpdate);
};

export const completeTask = async (id) => {
    const response = await api.put(
        `${BASE_PATH}/${id}/complete`,
    );

    return response.data;
};

export const deleteTask = async (id) => {
    await api.delete(`${BASE_PATH}/${id}`);
};