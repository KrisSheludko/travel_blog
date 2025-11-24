import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import Header from '../../components/Header';
import LoginForm from './LoginForm';
import '../../styles/Auth.scss';

const LoginPage = () => {
  const initialState = {
    email: '',
    password: ''
  };

  const validationRules = {
    email: {
      required: 'Email обязателен',
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      patternMessage: 'Введите корректный email'
    },
    password: {
      required: 'Пароль обязателен'
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

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        navigate('/');
      } else {
        setErrors({
          submit: result.message,
          email: 'error',
          password: 'error'
        });
      }
    } catch (error) {
      setErrors({
        submit: 'Произошла ошибка при авторизации'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="auth-page">
      <Header isHomePage={false} />
      <div className="auth-container">
        <div className="auth-form-container">
          <div className="auth-inner-container">
            <div className="auth-form-content">
              <h1>Вход в профиль</h1>

              <LoginForm
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onRegisterClick={handleRegisterClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;