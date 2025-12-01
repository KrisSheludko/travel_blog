import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/slices/authSlice';
import '../styles/Header.scss';
import logo from '../assets/images/Logo.png';

interface HeaderProps {
  isHomePage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isHomePage = false }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [localAvatar, setLocalAvatar] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) {
      const savedPhoto = localStorage.getItem(`avatar_${user.id}`);
      if (savedPhoto) {
        setLocalAvatar(savedPhoto);
      }
    }
  }, [user]);

  const handleLogout = (): void => {
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleLogin = (): void => {
    navigate('/login');
  };

  const toggleDropdown = (): void => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = (): void => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getUserInitials = (): string => {
    if (!user?.full_name) return 'U';
    return user.full_name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarUrl = localAvatar || user?.photo;

  return (
    <header className={`header ${isHomePage ? 'header--home' : 'header--other'}`}>
      <div className="container-header">
        <div className="header__top">
          <Link to="/" className="header__logo">
            <img src={logo} alt="TravelBlog Logo" className="header__logo-image" />
          </Link>
          {isAuthenticated ? (
            <div className="header__auth" ref={dropdownRef}>
              <div className="header__user-menu">
                <button
                  className="header__user-toggle"
                  onClick={toggleDropdown}
                >
                  <div className="header__user-avatar">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Аватар"
                        className="header__avatar-image"
                      />
                    ) : (
                      <div className="header__avatar-placeholder">
                        {getUserInitials()}
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