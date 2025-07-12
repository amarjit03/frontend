import api from './api';

export const tagsService = {
  // Create new tag
  createTag: async (tagData) => {
    const response = await api.post('/api/v1/tags/', tagData);
    return response.data;
  },

  // Get all tags
  getAllTags: async (params = {}) => {
    const response = await api.get('/api/v1/tags/', { params });
    return response.data;
  },

  // Get popular tags
  getPopularTags: async (params = {}) => {
    const response = await api.get('/api/v1/tags/popular', { params });
    return response.data;
  },

  // Search tags
  searchTags: async (query, params = {}) => {
    const response = await api.get('/api/v1/tags/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  },

  // Get tag details
  getTagDetails: async (tagName) => {
    const response = await api.get(`/api/v1/tags/${tagName}`);
    return response.data;
  },

  // Get questions by tag
  getQuestionsByTag: async (tagName, params = {}) => {
    const response = await api.get(`/api/v1/tags/${tagName}/questions`, { params });
    return response.data;
  }
};

