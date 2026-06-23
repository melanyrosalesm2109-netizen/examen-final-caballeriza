import api from './api';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const saveSession = (data) => {
    if (!data?.token) {
        throw new Error('El servidor no devolvió un token.');
    }

    const user = {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
        activo: data.activo ?? true,
    };

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return user;
};

const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    saveSession(response.data);
    return response.data;
};

const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    saveSession(response.data);
    return response.data;
};

const getMe = async () => {
    const response = await api.get('/auth/me');

    localStorage.setItem(
        USER_KEY,
        JSON.stringify(response.data),
    );

    return response.data;
};

const getStoredUser = () => {
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch {
        localStorage.removeItem(USER_KEY);
        return null;
    }
};

const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

const isAuthenticated = () => {
    return Boolean(getToken());
};

const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

const authService = {
    login,
    register,
    getMe,
    getStoredUser,
    getToken,
    isAuthenticated,
    logout,
};

export default authService;