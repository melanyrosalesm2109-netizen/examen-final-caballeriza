import api from './api';

const BASE_PATH = '/employees';

export const getEmployees = async () => {
    const response = await api.get(BASE_PATH);
    return response.data;
};

export const getEmployeeById = async (id) => {
    const response = await api.get(`${BASE_PATH}/${id}`);
    return response.data;
};

export const createEmployee = async (employee) => {
    const response = await api.post(BASE_PATH, employee);
    return response.data;
};

export const updateEmployee = async (id, employee) => {
    const response = await api.put(
        `${BASE_PATH}/${id}`,
        employee,
    );

    return response.data;
};

export const deleteEmployee = async (id) => {
    await api.delete(`${BASE_PATH}/${id}`);
};