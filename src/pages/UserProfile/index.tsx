import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { updateUserProfile, changeUserPassword, updateUserPhoto } from '../../store/slices/authSlice';
import Header from '../../components/Header';
import ImageCropper from '../../components/ImageCropper/ImageCropper';
import ProfileForm from './ProfileForm';
import ProfileInfo from './ProfileInfo';
import PhotoSection from './PhotoSection';
import { ProfileFormData as ProfileFormDataType } from '../../types';
import { compressImageForStorage } from './validation';
import '../../styles/UserProfilePage.scss';

const UserProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [passwordError, setPasswordError] = useState<string>('');
  const [touchedPasswords, setTouchedPasswords] = useState({
    password: false,
    confirmPassword: false
  });
  const [localAvatar, setLocalAvatar] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormDataType>({
    defaultValues: {
      full_name: '',
      city: '',
      bio: '',
      password: '',
      confirmPassword: '',
    },
  });

  const bioValue = watch('bio');
  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');

  useEffect(() => {
    if (touchedPasswords.password && touchedPasswords.confirmPassword) {
      if (passwordValue && confirmPasswordValue && passwordValue !== confirmPasswordValue) {
        setPasswordError('Пароли не совпадают');
      } else {
        setPasswordError('');
      }
    } else {
      setPasswordError('');
    }
  }, [passwordValue, confirmPasswordValue, touchedPasswords]);

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name || '',
        city: user.city || '',
        bio: user.bio || '',
        password: '',
        confirmPassword: '',
      });

      if (user.id) {
        const savedPhoto = localStorage.getItem(`avatar_${user.id}`);
        if (savedPhoto) {
          setLocalAvatar(savedPhoto);
        }
      }
    }
  }, [user, reset, dispatch]);

  const handleEditClick = () => {
    setIsEditing(true);
    setPasswordError('');
    setTouchedPasswords({ password: false, confirmPassword: false });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset({
      full_name: user?.full_name || '',
      city: user?.city || '',
      bio: user?.bio || '',
      password: '',
      confirmPassword: '',
    });
    setPasswordError('');
    setTouchedPasswords({ password: false, confirmPassword: false });
    clearErrors();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      setError('root', { message: 'Выберите файл в формате JPEG или PNG' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedFile: File) => {
    setShowCropper(false);
    setSelectedImage('');
    setIsUploading(true);

    try {
      const compressedBase64 = await compressImageForStorage(croppedFile, 200);

      if (user?.id) {
        localStorage.setItem(`avatar_${user.id}`, compressedBase64);
        setLocalAvatar(compressedBase64);
        dispatch(updateUserPhoto(compressedBase64));
      }

      const formData = new FormData();
      formData.append('photo', croppedFile);

      if (user) {
        formData.append('full_name', user.full_name || '');
        formData.append('city', user.city || '');
        if (user.bio) {
          formData.append('bio', user.bio);
        }
      }

      const result = await dispatch(updateUserProfile(formData));

      if (updateUserProfile.rejected.match(result)) {
        throw new Error(result.payload as string || 'Ошибка при загрузке аватара');
      }

    } catch (error: any) {
      setError('root', { message: error.message || 'Ошибка при загрузке аватара' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedImage('');
  };

  const onSubmit = async (data: ProfileFormDataType) => {
    if (passwordValue && confirmPasswordValue && passwordValue !== confirmPasswordValue) {
      setPasswordError('Пароли не совпадают');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('full_name', data.full_name);
      formData.append('city', data.city);
      if (data.bio) formData.append('bio', data.bio);

      const result = await dispatch(updateUserProfile(formData));

      if (updateUserProfile.rejected.match(result)) {
        throw new Error(result.payload as string || 'Ошибка при обновлении профиля');
      }

      if (data.password && data.password.trim() !== '') {
        const passwordResult = await dispatch(changeUserPassword(data.password));

        if (changeUserPassword.rejected.match(passwordResult)) {
          throw new Error(passwordResult.payload as string || 'Ошибка при смене пароля');
        }
      }

      setIsEditing(false);
      setPasswordError('');
      setTouchedPasswords({ password: false, confirmPassword: false });

    } catch (error: any) {
      setError('root', {
        type: 'manual',
        message: error.message || 'Ошибка при сохранении данных'
      });
    }
  };

  const getUserInitials = (): string => {
    if (!user?.full_name) return 'U';
    return user.full_name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarUrl = localAvatar || user?.photo;

  return (
    <div className="profile-page">
      <Header isHomePage={false} />
      <div className="profile-container">
        <div className="profile-content">
          {(error || errors.root) && (
            <div className="error-message">
              {error || errors.root?.message}
            </div>
          )}

          <div className="profile-layout">
            <PhotoSection
              user={user}
              avatarUrl={avatarUrl}
              isUploading={isUploading}
              getUserInitials={getUserInitials}
              onImageSelect={handleImageSelect}
            />

            <div className="profile-forms-section">
              {!isEditing ? (
                <ProfileInfo
                  user={user}
                  onEditClick={handleEditClick}
                />
              ) : (
                <ProfileForm
                  register={register}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  bioValue={bioValue}
                  passwordError={passwordError}
                  touchedPasswords={touchedPasswords}
                  setTouchedPasswords={setTouchedPasswords}
                  isSubmitting={isSubmitting}
                  isLoading={isLoading}
                  watch={watch}
                  onCancelEdit={handleCancelEdit}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {showCropper && (
        <ImageCropper
          image={selectedImage}
          onCrop={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default UserProfilePage;