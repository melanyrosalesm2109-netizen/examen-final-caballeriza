import axios from 'axios';

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL
        || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            const currentPath = window.location.pathname;

            if (
                currentPath !== '/login'
                && currentPath !== '/registro'
            ) {
                window.location.assign('/login');
            }
        }

        return Promise.reject(error);
    },
);

export default api;