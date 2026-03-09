import api from './axios.js';

export const usersApi = {
  getAll: () => api.get('/users'),
};
