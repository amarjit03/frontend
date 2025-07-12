import api from './api';

export const answersService = {
  // Create new answer
  createAnswer: async (answerData) => {
    const response = await api.post('/api/v1/answers/', answerData);
    return response.data;
  },

  // Get answers for a question
  getAnswersByQuestion: async (questionId, params = {}) => {
    const response = await api.get(`/api/v1/answers/question/${questionId}`, { params });
    return response.data;
  },

  // Get single answer
  getAnswer: async (answerId) => {
    const response = await api.get(`/api/v1/answers/${answerId}`);
    return response.data;
  },

  // Update answer
  updateAnswer: async (answerId, answerData) => {
    const response = await api.put(`/api/v1/answers/${answerId}`, answerData);
    return response.data;
  },

  // Delete answer
  deleteAnswer: async (answerId) => {
    const response = await api.delete(`/api/v1/answers/${answerId}`);
    return response.data;
  },

  // Accept answer
  acceptAnswer: async (answerId) => {
    const response = await api.post('/api/v1/answers/accept', { answer_id: answerId });
    return response.data;
  },

  // Get answers by user
  getAnswersByUser: async (userId, params = {}) => {
    const response = await api.get(`/api/v1/answers/user/${userId}`, { params });
    return response.data;
  }
};

