import React from 'react';
import TextField from '../../components/Form/TextField';
import PasswordField from '../../components/Form/PasswordField';

const RegisterForm = ({ formData, errors, isSubmitting, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="auth-form">
      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        error={errors.email}
        onChange={onChange}
        required={true}
        placeholder="Email"
      />

      <div className="password-row">
        <PasswordField
          label="Пароль"
          name="password"
          value={formData.password}
          error={errors.password}
          onChange={onChange}
          required={true}
          placeholder="Пароль"
        />

        <PasswordField
          label="Повторите пароль"
          name="confirmPassword"
          value={formData.confirmPassword}
          error={errors.password}
          onChange={onChange}
          required={true}
          placeholder="Повторите пароль"
        />
      </div>

      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <div className="auth-buttons">
        <button
          type="submit"
          className="register-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;