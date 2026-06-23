import api from './api';

const supplyRecordService = {
    async getAll() {
        const response = await api.get('/supply-records');
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/supply-records/${id}`);
        return response.data;
    },

    async getByHorseId(horseId) {
        const response = await api.get(
            `/supply-records/horse/${horseId}`,
        );

        return response.data;
    },

    async create(record) {
        const response = await api.post(
            '/supply-records',
            record,
        );

        return response.data;
    },

    async update(id, record) {
        const response = await api.put(
            `/supply-records/${id}`,
            record,
        );

        return response.data;
    },

    async remove(id) {
        await api.delete(`/supply-records/${id}`);
    },
};

export default supplyRecordService;