import React from 'react';
import TextField from '../../components/Form/TextField';

const LoginForm = ({ formData, errors, isSubmitting, onChange, onSubmit, onRegisterClick }) => {
  return (
    <>
      {errors.submit && (
        <div className="error-message-global">
          {errors.submit}
        </div>
      )}

      <form onSubmit={onSubmit} className="auth-form">
        <TextField
          label="Логин"
          name="email"
          type="email"
          value={formData.email}
          error={errors.email}
          onChange={onChange}
          required={true}
          placeholder="Email"
          showError={errors.email !== 'error'}
        />

        <TextField
          label="Пароль"
          name="password"
          type="password"
          value={formData.password}
          error={errors.password}
          onChange={onChange}
          required={true}
          placeholder="Пароль"
          showError={errors.password !== 'error'}
        />

        <div className="auth-buttons">
          <button
            type="button"
            className="register-button"
            onClick={onRegisterClick}
          >
            Зарегистрироваться
          </button>
          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;