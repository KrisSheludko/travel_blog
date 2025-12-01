import React from 'react';
import { User } from '../../types';

interface ProfileInfoProps {
  user: User | null;
  onEditClick: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, onEditClick }) => {
  return (
    <div className="profile-info-section">
      <div className="profile-info-header">
        <h1 className="profile-full-name">
          {user?.full_name || 'Ф.И.О. не указано'}
        </h1>
        <button
          className="edit-profile-button"
          onClick={onEditClick}
        >
          <svg className="edit-icon-svg" width="32" height="32">
            <use xlinkHref="#edit-icon"></use>
          </svg>
        </button>
      </div>

      <div className="profile-info-content">
        <div className="profile-info-row">
          <div className="profile-info-field">
            <span className="field-label">Город</span>
            <div className="field-value">{user?.city || 'Не указан'}</div>
          </div>
        </div>

        <div className="profile-info-row">
          <div className="profile-info-field">
            <span className="field-label">О себе</span>
            <div className="field-value">{user?.bio || 'Не указано'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;