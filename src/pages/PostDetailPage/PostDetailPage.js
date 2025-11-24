import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { postService } from '../../services/postService';
import Header from '../../components/Header';
import '../../styles/PostDetailPage.scss';

const PostDetailPage = () => {
  const { id } = useParams();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPostById(id),
  });

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
                <p>{error.message}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
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
              {post.photo && (
                <div className="post-detail__image-container">
                  <img
                    src={`http://travelblog.skillbox.cc${post.photo}`}
                    alt={post.title}
                    className="post-detail__image"
                  />
                </div>
              )}

              <div className="post-detail__content">
                <h1 className="post-detail__title">{post.title}</h1>

                <p className="post-detail__description">{post.description}</p>

                <div className="post-detail__comments">
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment, index) => (
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
                  <Link
                    to={`/posts/${id}/add-comment`}
                    className="post-detail__impression"
                  >
                    Ваше впечатление об этом месте
                  </Link>
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