import apiClient from './apiClient';

export const authService = {
    signIn: async (credentials) => {
        return apiClient.post('/auth/signIn', credentials);
    },

    signUp: async (userData) => {
        return apiClient.post('/auth/signUp', userData);
    },

    logout: async () => {
        return apiClient.post('/auth/logout');
    },
};
