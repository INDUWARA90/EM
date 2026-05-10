import apiClient from './client';

// Get all places
export const getPlaces = () => 
  apiClient.get('/places');

// Create event with letter PDF
export const createEvent = (formData) => 
  apiClient.post('/letter/place', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

// Get calendar events
export const getCalendarEvents = () => 
  apiClient.get('/calendar/events');

// Get my letters
export const getMyLetters = () => 
  apiClient.get('/letter/my');

export const getResponsiblePerson = (placeName) =>
  apiClient.get("/places/responsible-person", {
    params: { placeName },
  });