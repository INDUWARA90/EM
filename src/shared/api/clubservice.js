import apiClient from './client';

// create club
export const createClub = async (payload) => {
  return apiClient.post("/admin/clubs", payload);
};

export const getClubs = () =>
  apiClient.get('/clubs');

export const getMyClub = () =>
  apiClient.get('/me/club');

export const updateMyClub = (payload) =>
  apiClient.put('/me/club', payload);

export const updateMyClubBgImage = (formData) =>
  apiClient.post('/me/club/bg-image', formData);

