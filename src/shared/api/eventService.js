import apiClient from './client';

// Get all places
export const getPlaces = () => 
  apiClient.get('/places');

// Create event with letter PDF
export const createEvent = (formData) => 
  apiClient.post('/letter/place', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

// Dashboard calendar (inside app)
export const getDashboardCalendarBookings = () =>
  apiClient.get("/calendar/bookings");

// Public calendar (outside dashboard)
export const getPublicCalendarEvents = () =>
  apiClient.get("/calendar/event");

// Get my letters
export const getMyLetters = () => 
  apiClient.get('/letter/my');

export const getResponsiblePerson = (placeName) =>
  apiClient.get("/places/responsible-person", {
    params: { placeName },
  });

export const getResponsiblePersons = () =>
  apiClient.get("/auth/responsible-persons");
