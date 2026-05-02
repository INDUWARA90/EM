import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
export const API_SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 5000,
  withCredentials: true,
});

// Handle successful responses
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
