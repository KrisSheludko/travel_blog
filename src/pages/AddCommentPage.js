import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '../hooks/useForm';
import Header from '../components/Header';
import TextField from '../components/Form/TextField';
import TextArea from '../components/Form/TextArea';
import { postService } from '../services/postService';
import '../styles/AddCommentPage.scss';

const AddCommentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const initialState = {
    full_name: '',
    comment: ''
  };

  const validationRules = {
    full_name: {
      required: 'Напишите имя'
    },
    comment: {
      required: 'Добавьте текст отзыва',
      maxLength: 600,
      maxLengthMessage: 'Отзыв не должен превышать 600 символов'
    }
  };

  const {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    validateForm,
    setErrors
  } = useForm(initialState, validationRules);

  const addCommentMutation = useMutation({
    mutationFn: (commentData) => postService.addComment(id, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries(['post', id]);
      setShowSuccessModal(true);
    },
    onError: (error) => {
      setErrors({
        submit: error.message || 'Не удалось добавить комментарий'
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    addCommentMutation.mutate(formData);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate(`/posts/${id}`);
  };

  return (
    <div className="page">
      <Header isHomePage={false} />
      <main className="main add-comment-main">
        <div className="container">
          <div className="add-comment-container">
            <h1>Добавление отзыва</h1>

            {errors.submit && (
              <div className="auth-error-message">
                {errors.submit}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <TextField
                label="Ваше имя"
                name="full_name"
                type="text"
                value={formData.full_name}
                error={errors.full_name}
                onChange={handleChange}
                required={true}
                placeholder="Ваше имя"
              />

              <TextArea
                label="Отзыв"
                name="comment"
                value={formData.comment}
                error={errors.comment}
                onChange={handleChange}
                required={true}
                placeholder="Добавьте текст отзыва"
                maxLength={600}
              />

              <div className="comment-actions">
                <button
                  type="button"
                  className="back-button"
                  onClick={() => navigate(`/posts/${id}`)}
                  disabled={addCommentMutation.isLoading}
                >
                  ← Назад
                </button>
                <button
                  type="submit"
                  className="save-button"
                  disabled={addCommentMutation.isLoading}
                >
                  {addCommentMutation.isLoading ? 'Сохранение...' : 'Сохранить'}
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
              <h2>Ваш отзыв успешно добавлен</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCommentPage;