import api from "./api";

// Login
export const loginUser = async (credentials) => {
  const { data } = await api.post("/api/auth/signin", credentials);
  return data;
};

// Register
export const registerUser = async (userData) => {
  const { data } = await api.post("/api/auth/register", userData);
  return data;
};

// Current user
export const getCurrentUser = async () => {
  const { data } = await api.get("/api/auth/user");
  return data;
};