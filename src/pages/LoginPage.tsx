import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginUser, clearError } from '../store/slices/authSlice';
import { loginSchema, LoginFormData } from '../schemas';
import Header from '../components/Header';
import TextField from '../components/Form/TextField';
import '../styles/Auth.scss';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector(state => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(clearError());
      }, 5000);
    }
  }, [error, dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(loginUser(data));

    if (loginUser.rejected.match(result)) {
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

              {error && (
                <div className="login-error-message">
                  Неправильный логин или пароль
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <TextField
                  label="Логин"
                  name="email"
                  type="email"
                  error={errors.email?.message}
                  required={true}
                  placeholder="Email"
                  register={register}
                />

                <TextField
                  label="Пароль"
                  name="password"
                  type="password"
                  error={errors.password?.message}
                  required={true}
                  placeholder="Пароль"
                  register={register}
                />

                <div className="auth-buttons">
                  <button
                    type="button"
                    className="register-button"
                    onClick={handleRegisterClick}
                  >
                    Зарегистрироваться
                  </button>
                  <button
                    type="submit"
                    className="login-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Вход...' : 'Войти'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;