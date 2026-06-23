import api from './api';

const inventoryService = {
    async getAll() {
        const response = await api.get('/inventory');
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/inventory/${id}`);
        return response.data;
    },

    async getLowStock() {
        const response = await api.get('/inventory/low-stock');
        return response.data;
    },

    async create(item) {
        const response = await api.post('/inventory', item);
        return response.data;
    },

    async update(id, item) {
        const response = await api.put(`/inventory/${id}`, item);
        return response.data;
    },

    async remove(id) {
        await api.delete(`/inventory/${id}`);
    },
};

export default inventoryService;