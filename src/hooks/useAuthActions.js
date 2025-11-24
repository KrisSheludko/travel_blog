import { useCallback } from 'react';
import { authService } from '../services/authService';
import api from '../services/api';

export const useAuthActions = (isAuthenticated, setIsAuthenticated, setUser, setIsLoading, getStoredAvatar, clearStoredAvatar) => {
  const login = useCallback(async (email, password) => {
    try {
      const response = await authService.login(email, password);

      if (response.token) {
        const token = response.token;
        localStorage.setItem('authToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated(true);

        try {
          const userResponse = await api.get('/api/user');
          const userData = userResponse.data;

          const storedAvatar = getStoredAvatar(userData.id);
          if (storedAvatar) {
            userData.photo = storedAvatar;
          }

          setUser(userData);
        } catch (userError) {
          console.error('Error fetching user data after login:', userError);
        }

        return { success: true };
      } else {
        return {
          success: false,
          message: 'Неверный email или пароль'
        };
      }
    } catch (error) {
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Неправильный логин или пароль'
        };
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors.email) {
          return {
            success: false,
            message: errors.email[0]
          };
        } else if (errors.password) {
          return {
            success: false,
            message: errors.password[0]
          };
        }
      } else if (error.response?.status === 400) {
        return {
          success: false,
          message: 'Неверный email или пароль'
        };
      } else {
        return {
          success: false,
          message: 'Ошибка соединения с сервером'
        };
      }
    }
  }, [setIsAuthenticated, setUser, getStoredAvatar]);

  const register = useCallback(async (email, password) => {
    try {
      const response = await authService.register(email, password);

      if (response.token) {
        const token = response.token;
        localStorage.setItem('authToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated(true);

        try {
          const userResponse = await api.get('/api/user');
          const userData = userResponse.data;

          if (userData?.id) {
            clearStoredAvatar(userData.id);
          }

          setUser(userData);
        } catch (userError) {
          console.error('Error fetching user data after register:', userError);
        }

        return { success: true };
      } else {
        return {
          success: false,
          message: 'Ошибка регистрации'
        };
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors.email) {
          return {
            success: false,
            message: errors.email[0],
            field: 'email'
          };
        } else if (errors.password) {
          return {
            success: false,
            message: errors.password[0],
            field: 'password'
          };
        }
      } else if (error.response?.status === 400) {
        return {
          success: false,
          message: 'Аккаунт с данным email уже существует',
          field: 'email'
        };
      } else {
        return {
          success: false,
          message: 'Ошибка соединения с сервером'
        };
      }
    }
  }, [setIsAuthenticated, setUser, clearStoredAvatar]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [setIsAuthenticated, setUser]);

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return false;
      }

      const response = await api.get('/api/user');
      const userData = response.data;

      const storedAvatar = getStoredAvatar(userData.id);
      if (storedAvatar) {
        userData.photo = storedAvatar;
      }

      setUser(userData);
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    } catch (error) {
      logout();
      return false;
    }
  }, [setIsAuthenticated, setUser, setIsLoading, getStoredAvatar, logout]);

  return {
    login,
    register,
    logout,
    checkAuth
  };
};