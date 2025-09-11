// src/components/BaseCard.tsx
import React, { useEffect, useRef, useState } from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import './Header.scss';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../../contexts/AuthContext';

const todayDate = `Today, ${new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Ho_Chi_Minh',
  month: 'long',
  day: 'numeric',
})}`;
const HomeHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLogoMenuOpen, setIsLogoMenuOpen] = useState<boolean>(false);
  const logoRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (!isLogoMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (logoRef.current && !logoRef.current.contains(event.target as Node)) {
        setIsLogoMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isLogoMenuOpen]);

  const handleLogoClick = () => {
    setIsLogoMenuOpen((prev) => !prev);
  };

  const handleGoProfile = () => {
    setIsLogoMenuOpen(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    setIsLogoMenuOpen(false);
    logout();
    navigate('/');
  };

  useEffect(() => {
  }, [isLogoMenuOpen]);

  return (
    <header className="home-header">
      <div className="app-logo-background is-relative" ref={logoRef}>
        <Link to="/" className="app-logo-link">
          <span className="app-logo">
            <span className="text-primary">Reflect</span>
            <span className="text-secondary">ly</span>
          </span>
        </Link>
        {isLogoMenuOpen && (
          <div className="logo-dropdown-menu" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="logo-dropdown-item text-primary" onClick={handleGoProfile}>My profile</button>
            <div className="logo-dropdown-separator" />
            <button type="button" className="logo-dropdown-item text-danger" onClick={handleLogout}>Logout</button>
          </div>
        )}
        {user ? (
          // Login success
          <div className="user-info" onMouseDown={(e) => e.stopPropagation()} onClick={handleLogoClick}>
            <span className="profile-name">{user.fullName}</span>
            <img src={user.picture} alt={`Avatar ${user.fullName}`} className="profile-avatar" />
          </div>
        ) : (
          // Not Login
          <div>
          <Link to="/login" className="item">
            <AccountCircleOutlinedIcon className="profile-icon" />
          </Link>
          </div>
        )}
      </div>
      <h1 className="date">{todayDate}</h1>
    </header>
  );
};

export default HomeHeader;