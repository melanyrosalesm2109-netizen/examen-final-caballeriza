import api from './api';

const feedingPlanService = {
    async getAll() {
        const response = await api.get('/feeding-plans');
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/feeding-plans/${id}`);
        return response.data;
    },

    async getByHorseId(horseId) {
        const response = await api.get(
            `/feeding-plans/horse/${horseId}`,
        );

        return response.data;
    },

    async create(feedingPlan) {
        const response = await api.post(
            '/feeding-plans',
            feedingPlan,
        );

        return response.data;
    },

    async update(id, feedingPlan) {
        const response = await api.put(
            `/feeding-plans/${id}`,
            feedingPlan,
        );

        return response.data;
    },

    async remove(id) {
        await api.delete(`/feeding-plans/${id}`);
    },
};

export default feedingPlanService;