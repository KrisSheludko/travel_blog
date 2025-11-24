import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import api from '../services/api';
import { useAvatarStorage } from './useAvatarStorage';
import { useUser } from './useUser';
import { useAuthActions } from './useAuthActions';

export const useAuthProvider = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { getStoredAvatar, storeAvatar, clearStoredAvatar } = useAvatarStorage();
  const { updateUserData, uploadAvatar, changePassword, getUserInitials, getAvatarUrl, isCurrentUser } = useUser(user, setUser, getStoredAvatar, storeAvatar);
  const { login, register, logout, checkAuth } = useAuthActions(isAuthenticated, setIsAuthenticated, setUser, setIsLoading, getStoredAvatar, clearStoredAvatar);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/user');
      const userData = response.data;

      const storedAvatar = getStoredAvatar(userData.id);
      if (storedAvatar) {
        userData.photo = storedAvatar;
      }

      setUser(userData);
      setIsLoading(false);
      return userData;
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
      setIsLoading(false);
      return null;
    }
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    fetchUserData,
    updateUserData,
    changePassword,
    uploadAvatar,
    isCurrentUser,
    getUserInitials,
    getAvatarUrl
  };
};