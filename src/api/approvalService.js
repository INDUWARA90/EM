import apiClient from './client';

// Get letters to approve
export const getLettersToApprove = () => 
  apiClient.get('/letter/to-approve');

// Reject letter with reason
export const rejectLetter = (id, reason) => 
  apiClient.post(`/letter/${id}/reject`, { reason });

// Get letters approved by me
export const getApprovedByMe = () => 
  apiClient.get('/letter/approved-by-me');

// Get letters rejected by me
export const getRejectedByMe = () => 
  apiClient.get('/letter/rejected-by-me');
