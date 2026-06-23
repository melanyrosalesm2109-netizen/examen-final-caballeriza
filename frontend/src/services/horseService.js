import api from './api';

const horseService = {
    async getAll() {
        const response = await api.get('/horses');
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/horses/${id}`);
        return response.data;
    },

    async create(horse) {
        const response = await api.post('/horses', horse);
        return response.data;
    },

    async update(id, horse) {
        const response = await api.put(`/horses/${id}`, horse);
        return response.data;
    },

    async remove(id) {
        await api.delete(`/horses/${id}`);
    },
};

export default horseService;