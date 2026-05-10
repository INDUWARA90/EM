import apiClient from './client';

// create club
export const createClub = async (payload) => {
  return apiClient.post("/admin/clubs", payload);
};

export const getClubs = () =>
  apiClient.get('/clubs');

