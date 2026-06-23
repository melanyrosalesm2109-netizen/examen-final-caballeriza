import api from './api';

const BASE_PATH = '/shifts';

export const getShifts = async () => {
const response = await api.get(BASE_PATH);
return response.data;
};

export const getShiftById = async (id) => {
const response = await api.get(`${BASE_PATH}/${id}`);
return response.data;
};

export const getShiftsByEmployee = async (employeeId) => {
const response = await api.get(
`${BASE_PATH}/employee/${employeeId}`,
);


return response.data;

};

export const createShift = async (shift) => {
const response = await api.post(BASE_PATH, shift);
return response.data;
};

export const updateShift = async (id, shift) => {
const response = await api.put(
`${BASE_PATH}/${id}`,
shift,
);


return response.data;


};

export const deleteShift = async (id) => {
await api.delete(`${BASE_PATH}/${id}`);
};
