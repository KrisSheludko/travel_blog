import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addComment } from '../store/slices/postsSlice';
import Header from '../components/Header';
import '../styles/AddCommentPage.scss';

const AddCommentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.posts);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const {
    register,
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      full_name: '',
      comment: '',
    },
  });

  const commentValue = watch('comment');

  const onSubmit = async (data: any) => {
    if (!id) {
      alert('ID поста не найден');
      return;
    }

    const errors: { [key: string]: string } = {};

    if (!data.full_name.trim()) {
      errors.full_name = 'Напишите имя';
    }

    if (!data.comment.trim()) {
      errors.comment = 'Добавьте текст отзыва';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const result = await dispatch(addComment({
      postId: id,
      commentData: data
    }) as any);

    if (addComment.fulfilled.match(result)) {
      setShowSuccessModal(true);
    }
  };

  const clearError = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
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

            <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label>
                  <span className="required-star">*</span>
                  Ваше имя
                </label>
                <input
                  type="text"
                  {...register('full_name')}
                  placeholder="Ваше имя"
                  className={fieldErrors.full_name ? 'error' : ''}
                  onChange={() => clearError('full_name')}
                />
                {fieldErrors.full_name && (
                  <div className="error-text">
                    {fieldErrors.full_name}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>
                  <span className="required-star">*</span>
                  Отзыв
                </label>
                <textarea
                  {...register('comment')}
                  placeholder="Добавьте текст отзыва"
                  maxLength={600}
                  className={fieldErrors.comment ? 'error' : ''}
                  rows={4}
                  onChange={() => {
                    if (fieldErrors.comment === 'Добавьте текст отзыва') {
                      clearError('comment');
                    }
                  }}
                />
                <div className="bottom-line">
                  {fieldErrors.comment && (
                    <span className="error-text-inline">
                      {fieldErrors.comment}
                    </span>
                  )}
                  <span className="char-counter">
                    {commentValue?.length || 0} / 600
                  </span>
                </div>
              </div>

              <div className="comment-actions">
                <button
                  type="button"
                  className="back-button"
                  onClick={() => navigate(`/posts/${id}`)}
                  disabled={isLoading}
                >
                  ← Назад
                </button>
                <button
                  type="submit"
                  className="save-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Сохранение...' : 'Сохранить'}
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