import React from 'react';
import { User } from '../../types';

interface PhotoSectionProps {
  user: User | null;
  avatarUrl?: string;
  isUploading: boolean;
  getUserInitials: () => string;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhotoSection: React.FC<PhotoSectionProps> = ({
  user,
  avatarUrl,
  isUploading,
  getUserInitials,
  onImageSelect,
}) => {
  const displayAvatar = avatarUrl || user?.photo;

  return (
    <div className="profile-photo-section">
      <div className="profile-photo-container">
        <div className="profile-photo-wrapper">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt="Аватар пользователя"
              className="profile-photo"
            />
          ) : (
            <div className="profile-photo-placeholder">
              {getUserInitials()}
            </div>
          )}
          {isUploading && (
            <div className="photo-upload-overlay">
              <div className="upload-spinner"></div>
              <p>Обработка фото...</p>
            </div>
          )}
        </div>
        <div className="profile-photo-upload">
          <label htmlFor="photo-upload" className="photo-upload-label">
            <svg className="photo-upload-svg" width="32" height="32">
              <use xlinkHref="#photo-icon"></use>
            </svg>
            Изменить фото
          </label>
          <input
            type="file"
            id="photo-upload"
            onChange={onImageSelect}
            accept="image/jpeg,image/png"
            className="photo-upload-input"
            disabled={isUploading}
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoSection;