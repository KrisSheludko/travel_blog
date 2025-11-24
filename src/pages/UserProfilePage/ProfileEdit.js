import React from 'react';

const ProfileEdit = ({
  userData,
  passwordData,
  errors,
  isSubmitting,
  onUserDataChange,
  onPasswordChange,
  onCancel,
  onSubmit
}) => {

  const handleUserDataChange = (e) => {
    onUserDataChange(e);
  };

  const handlePasswordChange = (e) => {
    onPasswordChange(e);
  };

  return (
    <div className="profile-edit-section">
      <form onSubmit={onSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="full_name">
            <span className="required-star">*</span>
            Ф.И.О.
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={userData.full_name}
            onChange={handleUserDataChange}
            className={errors.full_name ? 'error' : ''}
            required
            maxLength={255}
            placeholder="Введите ваше полное имя"
          />
          {errors.full_name && <span className="error-text">{errors.full_name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="city">
            <span className="required-star">*</span>
            Город
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={userData.city}
            onChange={handleUserDataChange}
            className={errors.city ? 'error' : ''}
            required
            maxLength={255}
            placeholder="Введите ваш город"
          />
          {errors.city && <span className="error-text">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="bio">О себе</label>
          <textarea
            id="bio"
            name="bio"
            value={userData.bio}
            onChange={handleUserDataChange}
            className={errors.bio ? 'error' : ''}
            rows="4"
            maxLength={600}
            placeholder="Расскажите о себе..."
          />
          <div className="character-counter">
            {userData.bio.length} / 600
          </div>
          {errors.bio && <span className="error-text">{errors.bio}</span>}
        </div>

        <div className="password-section">
          <h3 className="password-title">Смена пароля</h3>

          <div className="password-row">
            <div className="password-field">
              <label htmlFor="password" className="password-label">
                Новый пароль
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={passwordData.password}
                onChange={handlePasswordChange}
                className={`password-input ${errors.password ? 'error' : ''}`}
                placeholder="Новый пароль"
              />
              {errors.password && <span className="password-error">{errors.password}</span>}
            </div>

            <div className="password-field">
              <label htmlFor="confirmPassword" className="password-label">
                Повторите пароль
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={`password-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Повторите пароль"
              />
              {errors.confirmPassword && <span className="password-error">{errors.confirmPassword}</span>}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="back-button"
            onClick={onCancel}
          >
            Назад
          </button>
          <button
            type="submit"
            className="save-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;