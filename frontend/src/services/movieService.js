import api from './api';

const MOVIES_ENDPOINT = '/movies';

const movieService = {
  getMovies: async (filters = {}) => {
    const { searchTerm, genres, page = 1, pageSize = 10 } = filters;
    let url = `${MOVIES_ENDPOINT}?page=${page}&pageSize=${pageSize}`;
    
    if (searchTerm) {
      url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    }
    
    if (genres && genres.length > 0) {
      genres.forEach(genre => {
        url += `&genres=${encodeURIComponent(genre)}`;
      });
    }
    
    const response = await api.get(url);
    return response.data;
  },

  getMovie: async (id) => {
    const response = await api.get(`${MOVIES_ENDPOINT}/${id}`);
    return response.data;
  },

  createMovie: async (movieData) => {
    const response = await api.post(MOVIES_ENDPOINT, movieData);
    return response.data;
  },

  updateMovie: async (id, movieData) => {
    const response = await api.put(`${MOVIES_ENDPOINT}/${id}`, movieData);
    return response.data;
  },

  deleteMovie: async (id) => {
    const response = await api.delete(`${MOVIES_ENDPOINT}/${id}`);
    return response.data;
  },

  getGenres: async () => {
    const response = await api.get(`${MOVIES_ENDPOINT}/genres`);
    return response.data;
  }
};

export default movieService;
