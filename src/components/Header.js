import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/images/Logo.png';
import '../styles/Header.scss';

const Header = ({ isHomePage = false }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`header ${isHomePage ? 'header--home' : 'header--other'}`}>
      <div className="container-header">
        <div className="header__top">
          <Link to="/" className="header__logo">
            <img src={Logo} alt="TravelBlog" className="header__logo-image" />
          </Link>
          {isAuthenticated ? (
            <div className="header__auth" ref={dropdownRef}>
              <div className="header__user-menu">
                <button
                  className="header__user-toggle"
                  onClick={toggleDropdown}
                >
                  <div className="header__user-avatar">
                    {user?.photo ? (
                      <img
                        src={user.photo}
                        alt="Аватар"
                        className="header__avatar-image"
                      />
                    ) : (
                      <div className="header__avatar-placeholder">
                        {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  <span className="header__user-name">
                    {user?.full_name || 'Пользователь'}
                  </span>
                  <svg
                    className={`header__dropdown-arrow ${isDropdownOpen ? 'header__dropdown-arrow--open' : ''}`}
                    width="11"
                    height="8"
                    viewBox="0 0 11 8"
                    fill="none"
                  >
                    <use xlinkHref="#open-menu" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="header__dropdown">
                    <button
                      className="header__dropdown-item"
                      onClick={handleProfileClick}
                    >
                      Профиль
                    </button>
                    <button
                      className="header__dropdown-item"
                      onClick={handleLogout}
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button className="header__login" onClick={handleLogin}>Войти</button>
          )}
        </div>

        <div className="header__content">
          <h1 className="header__title">
            {isHomePage ? 'Там, где мир начинается с путешествий' : 'Истории ваших путешествий'}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;