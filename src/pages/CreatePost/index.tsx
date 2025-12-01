import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { createPost } from '../../store/slices/postsSlice';
import Header from '../../components/Header';
import CreatePostForm from './CreatePostForm';
import '../../styles/CreatePostPage.scss';

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.posts);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      country: '',
      city: '',
    }
  });

  const handlePhotoChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const onSubmit = async (data: any) => {
    if (!selectedFile) {
      alert('Фото обязательно');
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('country', data.country);
    formData.append('city', data.city);
    formData.append('photo', selectedFile);

    const result = await dispatch(createPost(formData) as any);

    if (createPost.fulfilled.match(result)) {
      setShowSuccessModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <div className="page">
      <Header isHomePage={false} />
      <main className="main create-post-main">
        <div className="container">
          <CreatePostForm
            formErrors={{}}
            photoError=""
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isPostLoading={isLoading}
            onPhotoChange={handlePhotoChange}
            onBackClick={() => navigate('/')}
          />
        </div>
      </main>

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <button className="close-button" onClick={handleCloseModal}>
              ×
            </button>
            <div className="modal-content">
              <h2>Ваша история успешно добавлена</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostPage;