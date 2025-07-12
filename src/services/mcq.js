import api from './api';

export const mcqService = {
  // Create new quiz
  createQuiz: async (quizData) => {
    const response = await api.post('/api/v1/mcq/quiz', quizData);
    return response.data;
  },

  // Get quiz details
  getQuiz: async (quizId) => {
    const response = await api.get(`/api/v1/mcq/quiz/${quizId}`);
    return response.data;
  },

  // Get quiz questions
  getQuizQuestions: async (quizId) => {
    const response = await api.get(`/api/v1/mcq/quiz/${quizId}/questions`);
    return response.data;
  },

  // Submit quiz answers
  submitQuiz: async (submissionData) => {
    const response = await api.post('/api/v1/mcq/quiz/submit', submissionData);
    return response.data;
  },

  // Get user's quizzes
  getMyQuizzes: async (params = {}) => {
    const response = await api.get('/api/v1/mcq/my-quizzes', { params });
    return response.data;
  },

  // Get available topics
  getAvailableTopics: async () => {
    const response = await api.get('/api/v1/mcq/topics');
    return response.data;
  },

  // Get topic statistics
  getTopicStats: async (topic) => {
    const response = await api.get(`/api/v1/mcq/topics/${topic}/stats`);
    return response.data;
  },

  // Get topic leaderboard
  getTopicLeaderboard: async (topic, params = {}) => {
    const response = await api.get(`/api/v1/mcq/leaderboard/${topic}`, { params });
    return response.data;
  }
};

