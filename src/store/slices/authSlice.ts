import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';
import { authService } from '../../services/authService';
import api from '../../services/api';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      const token = response.token;
      localStorage.setItem('authToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const userData = await authService.getUser();

      if (userData.id) {
        const savedPhoto = localStorage.getItem(`avatar_${userData.id}`);
        if (savedPhoto) {
          userData.photo = savedPhoto;
        }
      }

      return userData;
    } catch (error: any) {
      return rejectWithValue('Неправильный логин или пароль');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.register(email, password);
      const token = response.token;
      localStorage.setItem('authToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const userData = await authService.getUser();

      if (userData.id) {
        const savedPhoto = localStorage.getItem(`avatar_${userData.id}`);
        if (savedPhoto) {
          userData.photo = savedPhoto;
        }
      }

      return userData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка регистрации');
    }
  }
);

export const fetchUserData = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await authService.getUser();

      if (userData.id) {
        const savedPhoto = localStorage.getItem(`avatar_${userData.id}`);
        if (savedPhoto) {
          userData.photo = savedPhoto;
        }
      }

      return userData;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
      }
      return rejectWithValue('Ошибка загрузки данных пользователя');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await authService.updateUser(formData);
      return response;
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessage = Object.values(errors).flat().join(', ');
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления профиля');
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  'auth/changePassword',
  async (password: string, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(password);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка смены пароля');
    }
  }
);

const token = localStorage.getItem('authToken');
const initialState: AuthState = {
  user: null,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      const userId = state.user?.id;

      localStorage.removeItem('authToken');

      delete api.defaults.headers.common['Authorization'];
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserPhoto: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.photo = action.payload;

        if (state.user.id) {
          try {
            localStorage.setItem(`avatar_${state.user.id}`, action.payload);
          } catch (error) {
            if (error instanceof Error && error.name === 'QuotaExceededError') {
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('avatar_') && key !== `avatar_${state.user.id}`) {
                  localStorage.removeItem(key);
                }
              }
              localStorage.setItem(`avatar_${state.user.id}`, action.payload);
            }
          }
        }
      }
    },
    clearUserPhotos: (state) => {
      const userId = state.user?.id;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('avatar_')) {
          if (!userId || key !== `avatar_${userId}`) {
            localStorage.removeItem(key);
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(changeUserPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, updateUserPhoto, clearUserPhotos } = authSlice.actions;
export default authSlice.reducer;