import api from './api';

export const authService = {
  register: async (email, password) => {
    const response = await api.post('/api/register', {
      email,
      password,
      password_confirmation: password
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/api/login', {
      email,
      password
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.get('/api/logout');
    return response.data;
  },

  refresh: async () => {
    const response = await api.post('/api/refresh');
    return response.data;
  }
};