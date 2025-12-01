import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import PostsListPage from './pages/PostsListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostDetailPage from './pages/PostDetailPage';
import AddCommentPage from './pages/AddCommentPage';
import CreatePostPage from './pages/CreatePost';
import UserProfilePage from './pages/UserProfile';
import SvgSprite from './components/SvgSprite';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <SvgSprite />
          <Routes>
            <Route path="/" element={<PostsListPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/posts/:id/add-comment" element={<AddCommentPage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="*" element={<PostsListPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;