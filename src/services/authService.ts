import axios from 'axios';

const API_BASE_URL = 'https://travelblog.skillbox.cc';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

interface AuthResponse {
  token: string;
}

interface UserData {
  id: number;
  email: string;
  full_name: string;
  city?: string;
  country?: string;
  bio?: string;
  photo?: string;
}

export const authService = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/register', {
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/login', {
      email,
      password,
    });
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.get<{ message: string }>('/api/logout');
    return response.data;
  },

  getUser: async (): Promise<UserData> => {
    const response = await api.get<UserData>('/api/user');
    return response.data;
  },

  updateUser: async (formData: FormData): Promise<UserData> => {
    const response = await api.post<UserData>('/api/user', formData, {
    });
    return response.data;
  },

  changePassword: async (password: string): Promise<{ message: string }> => {
    const response = await api.patch<{ message: string }>('/api/user/password', { password });
    return response.data;
  },
};