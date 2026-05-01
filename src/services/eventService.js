import api from "./api";

export const placeLetter = (formData) => {
  return api.post(API_ENDPOINTS.LETTERS.PLACE, formData);
};

export const getMyLetters = () => {
  return api.get(API_ENDPOINTS.LETTERS.MY);
};

export const getLettersToApprove = () => {
  return api.get(API_ENDPOINTS.LETTERS.TO_APPROVE);
};

export const approveLetter = (letterId) => {
  return api.post(`/letter/${letterId}/approve`);
};

export const rejectLetter = (id, reason) => {
  return api.post(`/letter/${id}/reject`, {
    rejectionReason: reason,
  });
};

export const getApprovedByMe = () => {
  return api.get(API_ENDPOINTS.LETTERS.APPROVED_BY_ME);
};

export const getRejectedByMe = () => {
  return api.get(API_ENDPOINTS.LETTERS.REJECTED_BY_ME);
};

export const getAllPlaces = () => {
  return api.get(API_ENDPOINTS.PLACES.ALL);
};

export const getResponsiblePersons = (placeName) => {
  return api.get(API_ENDPOINTS.PLACES.RESPONSIBLE_PERSON, {
    params: { placeName }
  });
};
