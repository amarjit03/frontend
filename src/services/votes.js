import api from './api';

export const votesService = {
  // Vote on an answer
  voteAnswer: async (voteData) => {
    const response = await api.post('/api/v1/votes/', voteData);
    return response.data;
  },

  // Get vote statistics for an answer
  getVoteStats: async (answerId) => {
    const response = await api.get(`/api/v1/votes/answer/${answerId}/stats`);
    return response.data;
  },

  // Get current user's vote for an answer
  getMyVote: async (answerId) => {
    const response = await api.get(`/api/v1/votes/answer/${answerId}/my-vote`);
    return response.data;
  },

  // Remove vote from an answer
  removeVote: async (answerId) => {
    const response = await api.delete(`/api/v1/votes/answer/${answerId}`);
    return response.data;
  }
};

