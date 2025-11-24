import { useCallback } from 'react';

export const useAvatarStorage = () => {
  const getStoredAvatar = useCallback((userId) => {
    try {
      if (!userId) return null;
      const storedAvatar = localStorage.getItem(`userAvatar_${userId}`);
      return storedAvatar || null;
    } catch (error) {
      console.error('Error getting stored avatar:', error);
      return null;
    }
  }, []);

  const storeAvatar = useCallback((userId, avatarData) => {
    try {
      if (userId && avatarData) {
        localStorage.setItem(`userAvatar_${userId}`, avatarData);
      }
    } catch (error) {
      console.error('Error storing avatar:', error);
    }
  }, []);

  const clearStoredAvatar = useCallback((userId) => {
    try {
      if (userId) {
        localStorage.removeItem(`userAvatar_${userId}`);
      }
    } catch (error) {
      console.error('Error clearing stored avatar:', error);
    }
  }, []);

  return {
    getStoredAvatar,
    storeAvatar,
    clearStoredAvatar
  };
};