export const useCommentValidation = () => {
  const validateFullName = (full_name) => {
    if (!full_name?.trim()) return 'Напишите имя';
    return null;
  };

  const validateComment = (comment) => {
    if (!comment?.trim()) return 'Добавьте текст отзыва';
    if (comment.length > 600) return 'Отзыв не должен превышать 600 символов';
    return null;
  };

  return {
    validateFullName,
    validateComment
  };
};