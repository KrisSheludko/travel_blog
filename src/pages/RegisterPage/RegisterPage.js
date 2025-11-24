import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import Header from '../../components/Header';
import RegisterForm from './RegisterForm';
import '../../styles/Auth.scss';

const RegisterPage = () => {
  const initialState = {
    email: '',
    password: '',
    confirmPassword: ''
  };

  const validationRules = {
    email: {
      required: 'Email обязателен',
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      patternMessage: 'Введите корректный email'
    },
    password: {
      required: 'Пароль обязателен',
      minLength: 6,
      minLengthMessage: 'Пароль должен содержать минимум 6 символов'
    },
    confirmPassword: {
      required: 'Подтвердите пароль',
      custom: (value, formData) => value !== formData.password ? 'Пароли не совпадают' : null
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

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await register(formData.email, formData.password);

      if (result.success) {
        navigate('/');
      } else {
        if (result.field === 'email') {
          setErrors({
            email: result.message === 'email' 
              ? 'Аккаунт с данным email уже существует' 
              : result.message
          });
        } else if (result.field === 'password') {
          setErrors({
            password: result.message
          });
        } else {
          setErrors({
            submit: result.message
          });
        }
      }
    } catch (error) {
      console.error('Register error:', error);
      setErrors({
        submit: 'Ошибка соединения с сервером'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <Header isHomePage={false} />
      <div className="auth-container">
        <div className="auth-form-container">
          <div className="auth-inner-container">
            <div className="auth-form-content">
              <h1>Регистрация</h1>

              <RegisterForm
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;