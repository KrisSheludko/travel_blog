import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { registerUser } from '../store/slices/authSlice';
import { registerSchema, RegisterFormData } from '../schemas';
import Header from '../components/Header';
import TextField from '../components/Form/TextField';
import PasswordField from '../components/Form/PasswordField';
import '../styles/Auth.scss';

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector(state => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    const result = await dispatch(registerUser({
      email: data.email,
      password: data.password
    }));

    if (registerUser.rejected.match(result)) {
      setFormError('root', {
        type: 'manual',
        message: result.payload as string
      });
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="auth-page">
      <Header isHomePage={false} />
      <div className="auth-container">
        <div className="auth-form-container">
          <div className="auth-inner-container">
            <div className="auth-form-content">
              <h1>Регистрация</h1>

              {(error || errors.root) && (
                <div className="error-message-global">
                  {error || errors.root?.message}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  error={errors.email?.message}
                  required={true}
                  placeholder="Email"
                  register={register}
                />

                <div className="password-row">
                  <PasswordField
                    label="Пароль"
                    name="password"
                    error={errors.password?.message}
                    required={true}
                    placeholder="Пароль"
                    register={register}
                  />

                  <PasswordField
                    label="Повторите пароль"
                    name="confirmPassword"
                    error={errors.confirmPassword?.message}
                    required={true}
                    placeholder="Повторите пароль"
                    register={register}
                  />
                </div>

                <div className="auth-buttons">
                  <button
                    type="button"
                    className="register-button"
                    onClick={handleLoginClick}
                    disabled={isLoading}
                  >
                    Войти
                  </button>
                  <button
                    type="submit"
                    className="login-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
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

export default RegisterPage;