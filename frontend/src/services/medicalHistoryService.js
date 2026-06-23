import api from './api';

const medicalHistoryService = {
    async getAll() {
        const response = await api.get('/medical-history');
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/medical-history/${id}`);
        return response.data;
    },

    async getByHorseId(horseId) {
        const response = await api.get(
            `/medical-history/horse/${horseId}`,
        );
        return response.data;
    },

    async create(medicalHistory) {
        const response = await api.post(
            '/medical-history',
            medicalHistory,
        );
        return response.data;
    },

    async update(id, medicalHistory) {
        const response = await api.put(
            `/medical-history/${id}`,
            medicalHistory,
        );
        return response.data;
    },

    async remove(id) {
        await api.delete(`/medical-history/${id}`);
    },
};

export default medicalHistoryService;