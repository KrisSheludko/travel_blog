import React, { useState } from 'react';

interface PhotoUploadProps {
  onPhotoChange: (file: File | null) => void;
  error?: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoChange, error }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      onPhotoChange(null);
      return;
    }

    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      onPhotoChange(null);
      return;
    }

    onPhotoChange(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="form-group photo-upload-first">
      <div className="photo-upload-wrapper">
        {photoPreview ? (
          <div className="photo-preview-container">
            <img
              src={photoPreview}
              alt="Предпросмотр"
              className="photo-preview"
            />
            <label className="photo-upload-button change-photo">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <use xlinkHref="#photo-pownload" />
              </svg>
              Изменить фото
              <input
                type="file"
                onChange={handlePhotoChange}
                accept="image/jpeg,image/png"
                className="photo-input"
              />
            </label>
          </div>
        ) : (
          <label className="photo-upload-button">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <use xlinkHref="#photo-pownload" />
            </svg>
            Загрузите ваше фото
            <input
              type="file"
              onChange={handlePhotoChange}
              accept="image/jpeg,image/png"
              className="photo-input"
            />
          </label>
        )}
      </div>
      {error && (
        <div className="error-text">
          {error}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;