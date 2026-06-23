import api from './api';

const BASE_PATH = '/tasks';

export const getTasks = async () => {
const response = await api.get(BASE_PATH);
return response.data;
};

export const getTaskById = async (id) => {
const response = await api.get(`${BASE_PATH}/${id}`);
return response.data;
};

export const filterTasks = async ({
employeeId = '',
estado = '',
fecha = '',
}) => {
const params = {};


if (employeeId) {
    params.employeeId = employeeId;
}

if (estado) {
    params.estado = estado;
}

if (fecha) {
    params.fecha = fecha;
}

const response = await api.get(
    `${BASE_PATH}/filter`,
    { params },
);

return response.data;


};

export const getTasksByEmployee = async (employeeId) => {
const response = await api.get(
`${BASE_PATH}/employee/${employeeId}`,
);


return response.data;


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
const response = await api.put(
`${BASE_PATH}/${id}/status`,
null,
{
params: {
estado,
},
},
);


return response.data;


};

export const deleteTask = async (id) => {
await api.delete(`${BASE_PATH}/${id}`);
};
