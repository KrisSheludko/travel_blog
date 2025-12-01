import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchPostById, clearCurrentPost } from '../store/slices/postsSlice';
import Header from '../components/Header';
import '../styles/PostDetailPage.scss';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentPost, isLoading, error } = useAppSelector(state => state.posts);
  const { isAuthenticated } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
    }

    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="page">
        <Header isHomePage={false} />
        <main className="main post-detail-main">
          <div className="container">
            <div className="post-detail-container">
              <div className="loading">Загрузка поста...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Header isHomePage={false} />
        <main className="main post-detail-main">
          <div className="container">
            <div className="post-detail-container">
              <div className="error">
                <h2>Ошибка загрузки поста</h2>
                <p>{error}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="page">
        <Header isHomePage={false} />
        <main className="main post-detail-main">
          <div className="container">
            <div className="post-detail-container">
              <div className="error">
                <h2>Пост не найден</h2>
                <Link to="/" className="back-link">Вернуться на главную</Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <Header isHomePage={false} />
      <main className="main post-detail-main">
        <div className="container">
          <div className="post-detail-container">
            <article className="post-detail">
              {currentPost.photo && (
                <div className="post-detail__image-container">
                  <img
                    src={`https://travelblog.skillbox.cc${currentPost.photo}`}
                    alt={currentPost.title}
                    className="post-detail__image"
                  />
                </div>
              )}

              <div className="post-detail__content">
                <h1 className="post-detail__title">{currentPost.title}</h1>

                <p className="post-detail__description">{currentPost.description}</p>

                <div className="post-detail__comments">
                  {currentPost.comments && currentPost.comments.length > 0 ? (
                    currentPost.comments.map((comment, index) => (
                      <div key={index} className="comment">
                        <strong>{comment.author_name}</strong>
                        <small>{new Date(comment.created_at).toLocaleDateString()}</small>
                        <p>{comment.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p>Пока нет комментариев</p>
                  )}
                </div>

                <div className="post-detail__actions">
                  <Link to="/" className="post-detail__back">← Назад</Link>
                  {isAuthenticated && (
                    <Link
                      to={`/posts/${id}/add-comment`}
                      className="post-detail__impression"
                    >
                      Ваше впечатление об этом месте
                    </Link>
                  )}
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetailPage;