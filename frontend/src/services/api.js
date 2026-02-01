
import axios from 'axios';

const URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api';

const api = axios.create({
    baseURL: URL,
    headers: { 'Content-Type': 'application/json'},
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response, 
    (error) => {
        return Promise.reject(error);
    }
);

export default api;