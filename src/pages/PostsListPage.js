import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { postService } from '../services/postService';
import Header from '../components/Header';
import '../styles/PostsListPage.scss';

const PostsListPage = () => {
  const { isAuthenticated } = useAuth();

  const {
    data: posts = [],
    isLoading,
    error,
    isError
  } = useQuery({
    queryKey: ['posts'],
    queryFn: postService.getPosts,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="page">
        <Header isHomePage={true} />
        <main className="main">
          <div className="container">
            <div className="loading">
              <h2>Загрузка постов...</h2>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page">
        <Header isHomePage={true} />
        <main className="main">
          <div className="container">
            <div className="error">
              <h2>Ошибка загрузки</h2>
              <p className="error__message">{error.message}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <Header isHomePage={true} />
      <main className="main">
        <div className="container">
          <div className="posts__grid">
            {posts.map(post => (
              <div key={post.id} className="postCard">
                {post.photo && (
                  <img
                    src={`https://travelblog.skillbox.cc${post.photo}`}
                    alt={post.title}
                    className="postCard__image"
                  />
                )}

                <div className="postCard__content">
                  <h3 className="postCard__title">
                    {post.title}
                  </h3>

                  <p className="postCard__excerpt">
                    {post.excerpt}
                  </p>

                  <div className="postCard__footer">
                    <span className="postCard__location">
                      {post.city || 'Местоположение не указано'}
                    </span>

                    <Link
                      to={`/posts/${post.id}`}
                      className="postCard__link"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isAuthenticated && (
            <div className="posts__add-button-container">
              <Link to="/create-post" className="posts__add-button">
                Добавить мое путешествие
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PostsListPage;