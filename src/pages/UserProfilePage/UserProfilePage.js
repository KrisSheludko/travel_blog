import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import Header from '../../components/Header';
import ImageCropper from '../../components/ImageCropper';
import ProfileView from './ProfileView';
import ProfileEdit from './ProfileEdit';
import '../../styles/UserProfilePage.scss';

const UserProfilePage = () => {
  const { user, updateUserData, changePassword, uploadAvatar, getUserInitials, getAvatarUrl } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const initialState = {
    full_name: '',
    city: '',
    bio: '',
    password: '',
    confirmPassword: ''
  };

  const validationRules = {
    full_name: {
      required: 'Ф.И.О. обязательно для заполнения'
    },
    city: {
      required: 'Город обязателен для заполнения'
    },
    password: {
      minLength: 6,
      minLengthMessage: 'Пароль должен содержать минимум 6 символов'
    },
    confirmPassword: {
      custom: (value, formData) => {
        if (formData.password && !value) return 'Подтвердите пароль';
        if (formData.password && value !== formData.password) return 'Пароли не совпадают';
        return null;
      }
    }
  };

  const {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    validateForm,
    setFieldValue,
    setErrors,
    resetForm
  } = useForm(initialState, validationRules);

  useEffect(() => {
    if (user && !isEditing) {
      setFieldValue('full_name', user.full_name || '');
      setFieldValue('city', user.city || '');
      setFieldValue('bio', user.bio || '');
    }
  }, [user, isEditing, setFieldValue]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    resetForm();
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      setErrors({ submit: 'Пожалуйста, выберите файл в формате JPEG или PNG' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      setShowCropper(true);
    };
    reader.onerror = () => {
      setErrors({ submit: 'Ошибка при чтении файла' });
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  const handleCropComplete = async (croppedFile) => {
    setShowCropper(false);
    setSelectedImage(null);
    setIsUploading(true);
    setErrors({});

    try {
      await uploadAvatar(croppedFile);
    } catch (error) {
      setErrors({ submit: 'Ошибка при загрузке аватара' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const userResult = await updateUserData({
        full_name: formData.full_name,
        city: formData.city,
        bio: formData.bio
      });

      if (!userResult.success) {
        setErrors({ submit: userResult.message });
        return;
      }

      if (formData.password) {
        const passwordResult = await changePassword({ password: formData.password });

        if (!passwordResult.success) {
          setErrors({ submit: passwordResult.message });
          return;
        }
      }

      setIsEditing(false);
      resetForm();

    } catch (error) {
      setErrors({ submit: 'Ошибка при сохранении данных' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const avatarUrl = getAvatarUrl();

  return (
    <div className="profile-page">
      <Header isHomePage={false} />
      <div className="profile-container">
        <div className="profile-content">
          {errors.submit && (
            <div className="error-message">
              {errors.submit}
            </div>
          )}

          <div className="profile-layout">
            <div className="profile-photo-section">
              <div className="profile-photo-container">
                <div className="profile-photo-wrapper">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Аватар пользователя"
                      className="profile-photo"
                    />
                  ) : (
                    <div className="profile-photo-placeholder">
                      {getUserInitials()}
                    </div>
                  )}
                  {isUploading && (
                    <div className="photo-upload-overlay">
                      <div className="upload-spinner"></div>
                    </div>
                  )}
                </div>
                <div className="profile-photo-upload">
                  <label htmlFor="photo-upload" className="photo-upload-label">
                    <svg className="photo-upload-svg" width="32" height="32">
                      <use xlinkHref="#photo-icon"></use>
                    </svg>
                    Изменить фото
                  </label>
                  <input
                    type="file"
                    id="photo-upload"
                    name="photo"
                    onChange={handleImageSelect}
                    accept="image/jpeg,image/png"
                    className="photo-upload-input"
                    disabled={isUploading}
                  />
                </div>
              </div>
            </div>

            <div className="profile-forms-section">
              {!isEditing ? (
                <ProfileView
                  user={user}
                  onEditClick={handleEditClick}
                />
              ) : (
                <ProfileEdit
                  userData={formData}
                  passwordData={formData}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  onUserDataChange={handleChange}
                  onPasswordChange={handleChange}
                  onCancel={handleCancelEdit}
                  onSubmit={handleSubmit}
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