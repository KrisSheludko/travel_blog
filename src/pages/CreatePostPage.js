import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '../hooks/useForm';
import Header from '../components/Header';
import TextField from '../components/Form/TextField';
import TextArea from '../components/Form/TextArea';
import { postService } from '../services/postService';
import '../styles/CreatePostPage.scss';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const initialState = {
    title: '',
    description: '',
    country: '',
    city: '',
    photo: null
  };

  const validationRules = {
    title: {
      required: 'Напишите заголовок',
      maxLength: 255,
      maxLengthMessage: 'Заголовок не должен превышать 255 символов'
    },
    description: {
      required: 'Добавьте описание',
      maxLength: 2000,
      maxLengthMessage: 'Описание не должно превышать 2000 символов'
    },
    country: {
      required: 'Напишите название страны'
    },
    city: {
      required: 'Напишите название города'
    },
    photo: {
      required: 'Фото обязательно'
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
    setFieldError,
    setErrors
  } = useForm(initialState, validationRules);

  const createPostMutation = useMutation({
    mutationFn: (postData) => postService.createPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      setShowSuccessModal(true);
    },
    onError: (error) => {
      setErrors({
        submit: error.message || 'Не удалось создать пост'
      });
    }
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      setFieldError('photo', 'Пожалуйста, выберите файл в формате JPEG или PNG');
      return;
    }

    handleChange(e);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    createPostMutation.mutate(formData);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <div className="page">
      <Header isHomePage={false} />
      <main className="main create-post-main">
        <div className="container">
          <div className="create-post-container">
            <h1>Добавление истории о путешествии</h1>

            {errors.submit && (
              <div className="auth-error-message">
                {errors.submit}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group photo-upload-first">
                <div className="photo-upload-wrapper">
                  {photoPreview ? (
                    <div className="photo-preview-container">
                      <img
                        src={photoPreview}
                        alt="Предпросмотр"
                        className="photo-preview"
                      />
                      <label className="photo-upload-button change-photo">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <use xlinkHref="#photo-pownload" />
                        </svg>
                        Изменить фото
                        <input
                          type="file"
                          name="photo"
                          onChange={handlePhotoChange}
                          accept="image/jpeg,image/png"
                          className="photo-input"
                          id="photo-upload"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="photo-upload-button" htmlFor="photo-upload">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <use xlinkHref="#photo-pownload" />
                      </svg>
                      Загрузите ваше фото
                      <input
                        type="file"
                        name="photo"
                        onChange={handlePhotoChange}
                        accept="image/jpeg,image/png"
                        className="photo-input"
                        id="photo-upload"
                      />
                    </label>
                  )}
                </div>
                {errors.photo && (
                  <div className="error-text">{errors.photo}</div>
                )}
              </div>

              <TextField
                label="Заголовок"
                name="title"
                type="text"
                value={formData.title}
                error={errors.title}
                onChange={handleChange}
                required={true}
                placeholder="Заголовок"
                maxLength={255}
              />

              <div className="location-row">
                <TextField
                  label="Страна"
                  name="country"
                  type="text"
                  value={formData.country}
                  error={errors.country}
                  onChange={handleChange}
                  required={true}
                  placeholder="Страна"
                  maxLength={255}
                />

                <TextField
                  label="Город"
                  name="city"
                  type="text"
                  value={formData.city}
                  error={errors.city}
                  onChange={handleChange}
                  required={true}
                  placeholder="Город"
                  maxLength={255}
                />
              </div>

              <TextArea
                label="Описание"
                name="description"
                value={formData.description}
                error={errors.description}
                onChange={handleChange}
                required={true}
                placeholder="Добавьте описание вашей истории"
                maxLength={2000}
              />

              <div className="post-actions">
                <button
                  type="button"
                  className="back-button"
                  onClick={() => navigate('/')}
                  disabled={createPostMutation.isLoading}
                >
                  ← Назад
                </button>
                <button
                  type="submit"
                  className="save-button"
                  disabled={createPostMutation.isLoading}
                >
                  {createPostMutation.isLoading ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <button className="close-button" onClick={handleCloseModal}>
              <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
                <use xlinkHref="#close-icon" />
              </svg>
            </button>
            <div className="modal-content">
              <h2>Ваша история успешно добавлена</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostPage;