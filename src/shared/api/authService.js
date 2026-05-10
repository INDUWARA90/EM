import apiClient from './client';

// Check API status
export const checkApi = () => 
  apiClient.get('/check');

// Login with regNumber and password
export const login = (regNumber, password) => 
  apiClient.post('/auth/signin', { regNumber, password });

// Register new user
export const register = (username, email, password, regNumber, role) => 
  apiClient.post('/auth/register', { username, email, password, regNumber, role: [role] });

export const logoutUser = async () => {
   apiClient.post("/api/auth/signout");
};