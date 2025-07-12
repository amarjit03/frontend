import api from './api';

export const questionsService = {
  // Get all questions with optional filtering
  getQuestions: async (params = {}) => {
    const response = await api.get('/api/v1/questions/', { params });
    return response.data;
  },

  // Get single question with user info
  getQuestion: async (questionId) => {
    const response = await api.get(`/api/v1/questions/${questionId}`);
    return response.data;
  },

  // Create new question
  createQuestion: async (questionData) => {
    const response = await api.post('/api/v1/questions/', questionData);
    return response.data;
  },

  // Update question
  updateQuestion: async (questionId, questionData) => {
    const response = await api.put(`/api/v1/questions/${questionId}`, questionData);
    return response.data;
  },

  // Delete question
  deleteQuestion: async (questionId) => {
    const response = await api.delete(`/api/v1/questions/${questionId}`);
    return response.data;
  },

  // Get questions by user
  getQuestionsByUser: async (userId, params = {}) => {
    const response = await api.get(`/api/v1/questions/user/${userId}`, { params });
    return response.data;
  }
};

