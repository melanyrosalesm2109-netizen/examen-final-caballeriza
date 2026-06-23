import api from './api';

const BASE_PATH = '/reservations';

export const getReservations = async () => {
    const response = await api.get(BASE_PATH);
    return response.data;
};

export const filterReservations = async ({
    tipo = '',
    fecha = '',
    estado = '',
}) => {
    const params = {};

    if (tipo) {
        params.tipo = tipo;
    }

    if (fecha) {
        params.fecha = fecha;
    }

    if (estado) {
        params.estado = estado;
    }

    const response = await api.get(`${BASE_PATH}/filter`, {
        params,
    });

    return response.data;
};

export const getReservationById = async (id) => {
    const response = await api.get(`${BASE_PATH}/${id}`);
    return response.data;
};

export const createReservation = async (reservation) => {
    const response = await api.post(BASE_PATH, reservation);
    return response.data;
};

export const updateReservation = async (id, reservation) => {
    const response = await api.put(
        `${BASE_PATH}/${id}`,
        reservation,
    );

    return response.data;
};

export const cancelReservation = async (id) => {
    const response = await api.put(
        `${BASE_PATH}/${id}/cancel`,
    );

    return response.data;
};

export const reserveSlot = async (id) => {
    const response = await api.put(
        `${BASE_PATH}/${id}/reserve-slot`,
    );

    return response.data;
};

export const deleteReservation = async (id) => {
    await api.delete(`${BASE_PATH}/${id}`);
};