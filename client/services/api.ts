import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.130.149.101:5000'; // base url with my laptop ip address

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const auth = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (name, email, password) => api.post('/auth/register', { name, email, password }),
    logout: async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
    },
    getCurrentUser: async () => {
        const userStr = await AsyncStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};

export const wallet = {
    getBalance: () => api.get('/wallet/balance'),
    topUp: (amount, paymentMethod) => api.post('/wallet/topup', { amount, paymentMethod }),
};

export const payments = {
    getHistory: () => api.get('/payments/history'),
    getIntents: () => api.get('/payments/intents'),
};

export default api;
