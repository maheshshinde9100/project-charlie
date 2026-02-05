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
            config.headers.Authorization = `Bearer ${token}`; // Standard Bearer token format
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const auth = {
    login: (email: string, password: string) => api.post('/auth/login', { email, password }),
    register: (name: string, email: string, password: string) => api.post('/auth/register', { name, email, password }),
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
    topUp: (amount: number, paymentMethod: string) => api.post('/wallet/topup', { amount, paymentMethod }),
};

export const payments = {
    getHistory: () => api.get('/payments/history'),
    getIntents: () => api.get('/payments/intents'),
    getIntentDetails: (id: string) => api.get(`/payments/intents/${id}`),
    getTransactionDetails: (id: string) => api.get(`/payments/transaction/${id}`),
    initiatePayment: (receiverId: string, amount: string | number, note: string) =>
        api.post('/payments/initiate', { receiverId, amount: parseFloat(amount.toString()), note }),
};

export const notifications = {
    getNotifications: () => api.get('/notifications'),
    markAsRead: (id: number) => api.put(`/notifications/${id}/read`),
};

export default api;
