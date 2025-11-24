export const useAuthValidation = () => {
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email обязателен';
    if (!emailRegex.test(email)) return 'Введите корректный email';
    return null;
  };

  const validatePassword = (password, confirmPassword = '') => {
    if (!password) return 'Пароль обязателен';
    if (password.length < 6) return 'Пароль должен содержать минимум 6 символов';
    if (confirmPassword && password !== confirmPassword) return 'Пароли не совпадают';
    return null;
  };

  const validateConfirmPassword = (confirmPassword, password = '') => {
    if (!confirmPassword) return 'Подтвердите пароль';
    if (password && password !== confirmPassword) return 'Пароли не совпадают';
    return null;
  };

  return {
    validateEmail,
    validatePassword,
    validateConfirmPassword
  };
};