import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api',
  timeout: 5000,
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
