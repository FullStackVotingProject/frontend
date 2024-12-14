import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const register = async (userData) => {
    try {
        console.log('Sending registration request:', userData);
        const response = await api.post('/users/register', userData);
        console.log('Registration response:', response.data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error('Registration error details:', error.response || error);
        if (error.response?.data?.message) {
            throw { message: error.response.data.message };
        } else if (error.response?.status === 400) {
            throw { message: 'Données invalides. Veuillez vérifier vos informations.' };
        } else if (error.response?.status === 409) {
            throw { message: 'Cet email est déjà utilisé.' };
        } else if (!error.response) {
            throw { message: 'Erreur de connexion au serveur. Veuillez vérifier votre connexion internet.' };
        } else {
            throw { message: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.' };
        }
    }
};

export const login = async (email, password) => {
    try {
        const response = await api.post('/users/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data);
        if (error.response?.data?.message === 'Veuillez vérifier votre email avant de vous connecter') {
            throw { 
                message: error.response.data.message,
                needsVerification: true 
            };
        }
        throw error.response?.data || { message: 'Une erreur est survenue' };
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getProfile = async () => {
    try {
        const response = await api.get('/users/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Une erreur est survenue' };
    }
};

export const verifyEmail = async (token) => {
    try {
        const response = await api.get(`/users/verify-email/${token}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Une erreur est survenue' };
    }
};

export const resendVerification = async (email) => {
    try {
        const response = await api.post('/users/resend-verification', { email });
        return response.data;
    } catch (error) {
        if (error.response?.status === 429) {
            throw {
                message: error.response.data.message || 'Veuillez attendre 5 minutes avant de demander un nouveau lien',
                cooldown: true
            };
        }
        throw error.response?.data || { message: 'Erreur lors de l\'envoi de l\'email de vérification' };
    }
};

export default api;
