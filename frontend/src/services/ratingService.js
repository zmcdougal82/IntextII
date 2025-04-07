import api from './api';

const RATINGS_ENDPOINT = '/ratings';

const ratingService = {
  getUserRatings: async () => {
    const response = await api.get(RATINGS_ENDPOINT);
    return response.data;
  },

  getRating: async (movieId) => {
    const response = await api.get(`${RATINGS_ENDPOINT}/${movieId}`);
    return response.data;
  },

  createRating: async (ratingData) => {
    const response = await api.post(RATINGS_ENDPOINT, ratingData);
    return response.data;
  },

  updateRating: async (movieId, ratingData) => {
    const response = await api.put(`${RATINGS_ENDPOINT}/${movieId}`, ratingData);
    return response.data;
  },

  deleteRating: async (movieId) => {
    const response = await api.delete(`${RATINGS_ENDPOINT}/${movieId}`);
    return response.data;
  }
};

export default ratingService;
