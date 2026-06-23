import api from './api';

const BASE_PATH = '/users';

const getAll = async () => {
    const response = await api.get(BASE_PATH);
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`${BASE_PATH}/${id}`);
    return response.data;
};

const updateRole = async (id, rol) => {
    const response = await api.put(
        `${BASE_PATH}/${id}/role`,
        {
            rol,
        },
    );

    return response.data;
};

const updateActive = async (id, activo) => {
    const response = await api.put(
        `${BASE_PATH}/${id}/active`,
        {
            activo,
        },
    );

    return response.data;
};

const remove = async (id) => {
    await api.delete(`${BASE_PATH}/${id}`);
};

const userService = {
    getAll,
    getById,
    updateRole,
    updateActive,
    remove,
};

export default userService;