import api from './api';

export const ALERTS_UPDATED_EVENT = 'alerts-updated';

const notifyAlertsUpdated = () => {
    window.dispatchEvent(
        new CustomEvent(ALERTS_UPDATED_EVENT),
    );
};

const getAll = async () => {
    const response = await api.get('/alerts');
    return response.data;
};

const getUnread = async () => {
    const response = await api.get('/alerts/unread');
    return response.data;
};

const create = async (alert) => {
    const response = await api.post('/alerts', alert);

    notifyAlertsUpdated();

    return response.data;
};

const markAsRead = async (id) => {
    const response = await api.put(`/alerts/${id}/read`);

    notifyAlertsUpdated();

    return response.data;
};

const markAsUnread = async (id) => {
    const response = await api.put(`/alerts/${id}/unread`);

    notifyAlertsUpdated();

    return response.data;
};

const generateLowStock = async () => {
    const response = await api.post(
        '/alerts/generate-low-stock',
    );

    notifyAlertsUpdated();

    return response.data;
};

const remove = async (id) => {
    await api.delete(`/alerts/${id}`);

    notifyAlertsUpdated();
};

const alertService = {
    getAll,
    getUnread,
    create,
    markAsRead,
    markAsUnread,
    generateLowStock,
    remove,
};

export default alertService;