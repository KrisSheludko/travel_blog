import { useCallback } from 'react';
import api from '../services/api';

export const useUser = (user, setUser, getStoredAvatar, storeAvatar) => {
  const updateUserData = useCallback(async (userData) => {
    try {
      const formData = new FormData();

      if (userData.full_name) formData.append('full_name', userData.full_name);
      if (userData.city) formData.append('city', userData.city);
      if (userData.country) formData.append('country', userData.country);
      if (userData.bio) formData.append('bio', userData.bio);

      const response = await api.post('/api/user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUser = {
        ...user,
        ...response.data,
        photo: user?.photo || getStoredAvatar(user?.id)
      };

      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      let message = 'Ошибка при обновлении данных';
      if (error.response?.data?.errors) {
        message = Object.values(error.response.data.errors).flat().join(', ');
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      return {
        success: false,
        message: message
      };
    }
  }, [user, setUser, getStoredAvatar]);

  const uploadAvatar = useCallback(async (file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      if (user?.full_name) formData.append('full_name', user.full_name);
      if (user?.city) formData.append('city', user.city);
      if (user?.country) formData.append('country', user.country);
      if (user?.bio) formData.append('bio', user.bio);

      const response = await api.post('/api/user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = (e) => {
          const base64Image = e.target.result;

          if (user?.id) {
            storeAvatar(user.id, base64Image);
          }

          const updatedUser = {
            ...response.data,
            photo: base64Image
          };

          setUser(updatedUser);

          resolve({
            success: true,
            user: updatedUser
          });
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      return {
        success: false,
        message: 'Ошибка при загрузке аватара'
      };
    }
  }, [user, setUser, storeAvatar]);

  const changePassword = useCallback(async (passwordData) => {
    try {
      const response = await api.patch('/api/user/password', {
        password: passwordData.password
      });

      return { success: true };
    } catch (error) {
      console.error('Error changing password:', error);

      let message = 'Ошибка при смене пароля';
      if (error.response?.status === 400) {
        if (error.response?.data?.password) {
          message = error.response.data.password[0];
        } else if (error.response?.data?.message) {
          message = error.response.data.message;
        }
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      return {
        success: false,
        message: message
      };
    }
  }, []);

  const getUserInitials = useCallback(() => {
    if (!user?.full_name) return 'U';
    return user.full_name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user]);

  const getAvatarUrl = useCallback(() => {
    if (user?.photo) {
      return user.photo;
    }

    if (user?.id) {
      const storedAvatar = getStoredAvatar(user.id);
      if (storedAvatar) {
        if (!user.photo) {
          setTimeout(() => {
            setUser(prev => ({
              ...prev,
              photo: storedAvatar
            }));
          }, 0);
        }
        return storedAvatar;
      }
    }

    return null;
  }, [user, getStoredAvatar, setUser]);

  const isCurrentUser = useCallback((userId) => {
    return user && user.id === userId;
  }, [user]);

  return {
    updateUserData,
    uploadAvatar,
    changePassword,
    getUserInitials,
    getAvatarUrl,
    isCurrentUser
  };
};