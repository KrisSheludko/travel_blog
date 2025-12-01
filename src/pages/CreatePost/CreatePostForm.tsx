import React from 'react';
import { UseFormRegister, UseFormHandleSubmit } from 'react-hook-form';
import TextField from '../../components/Form/TextField';
import TextArea from '../../components/Form/TextArea';
import PhotoUpload from './PhotoUpload';

interface CreatePostFormProps {
  formErrors: any;
  photoError: string;
  register: UseFormRegister<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  onSubmit: (data: any) => Promise<void>;
  isPostLoading: boolean;
  onPhotoChange: (file: File | null) => void;
  onBackClick: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({
  formErrors,
  photoError,
  register,
  handleSubmit,
  onSubmit,
  isPostLoading,
  onPhotoChange,
  onBackClick,
}) => {
  return (
    <div className="create-post-container">
      <h1>Добавление истории о путешествии</h1>

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <PhotoUpload
          onPhotoChange={onPhotoChange}
          error={photoError}
        />

        <TextField
          label="Заголовок"
          name="title"
          type="text"
          error={formErrors.title}
          required={true}
          placeholder="Заголовок"
          maxLength={255}
          register={register}
        />

        <div className="location-row">
          <TextField
            label="Страна"
            name="country"
            type="text"
            error={formErrors.country}
            required={true}
            placeholder="Страна"
            maxLength={255}
            register={register}
          />

          <TextField
            label="Город"
            name="city"
            type="text"
            error={formErrors.city}
            required={true}
            placeholder="Город"
            maxLength={255}
            register={register}
          />
        </div>

        <TextArea
          label="Описание"
          name="description"
          error={formErrors.description}
          required={true}
          placeholder="Добавьте описание вашей истории"
          maxLength={2000}
          register={register}
        />

        <div className="post-actions">
          <button
            type="button"
            className="back-button"
            onClick={onBackClick}
            disabled={isPostLoading}
          >
            ← Назад
          </button>
          <button
            type="submit"
            className="save-button"
            disabled={isPostLoading}
          >
            {isPostLoading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;