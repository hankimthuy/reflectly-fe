import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuLogOut, LuMenu, LuUser, LuX } from 'react-icons/lu';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import './MimoHeader.scss';

interface MimoHeaderProps {
  activeTheme?: 'split' | 'inner' | 'outer';
  scrolled?: boolean;
}

const MimoHeader = ({ activeTheme = 'split', scrolled = false }: MimoHeaderProps) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isUserMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
    navigate(APP_ROUTES.WELCOME || '/');
  };

  const handleGoProfile = () => {
    setIsUserMenuOpen(false);
    navigate(APP_ROUTES.PROFILE || '/profile');
  };

  const handleLogin = () => {
    navigate(APP_ROUTES.LOGIN || '/login');
  };

  return (
    <nav className={`mimo-header mimo-header--${activeTheme} ${scrolled ? 'mimo-header--scrolled' : ''}`}>
      <div className="mimo-header__container">
        {/* LOGO */}
        <div className="mimo-header__logo" onClick={() => navigate('/')}>
          <span>MimoSe</span>
        </div>
        
        {/* DESKTOP MENU */}
        <div className="mimo-header__nav">
          <a href="#inner">The Innerverse</a>
          <a href="#outer">The Outerverse</a>
          <a href="#pillars">The 6 Pillars</a>
          
          {/* AUTH LOGIC SWITCHER */}
                    {currentUser ? (
            // CASE 1: LOGGED IN - Gemini Style Avatar
            <div className="mimo-header__user" ref={userMenuRef}>
              <div 
                className="mimo-header__avatar-wrapper"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                title={currentUser.fullName}
              >
                {currentUser.pictureUrl && !avatarError ? (
                  <img 
                    src={currentUser.pictureUrl} 
                    alt="User Avatar" 
                    className="avatar-img"
                    onError={() => setAvatarError(true)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {currentUser.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>

              {/* DROPDOWN MENU */}
              {isUserMenuOpen && (
                <div className="mimo-header__dropdown">
                  <div className="dropdown-header">
                    <span className="user-name">{currentUser.fullName}</span>
                    <span className="user-email">{currentUser.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleGoProfile} className="dropdown-item">
                    <LuUser size={16} /> My Profile
                  </button>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item text-red-500">
                    <LuLogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // CASE 2: NOT LOGGED IN
            <button className="btn-cta" onClick={handleLogin}>
              Start Journey
            </button>
          )}
        </div>
        
        {/* MOBILE TOGGLE */}
        <button className="mimo-header__toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <LuX /> : <LuMenu />}
        </button>
      </div>

     {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div className="mimo-header__mobile-menu">
          <a href="#inner" onClick={() => setIsMenuOpen(false)}>The Innerverse</a>
          <a href="#outer" onClick={() => setIsMenuOpen(false)}>The Outerverse</a>
          <a href="#pillars" onClick={() => setIsMenuOpen(false)}>The 6 Pillars</a>
          <div className="divider"></div>
          {currentUser ? (
             <>
                <div className="mobile-user-info">
                    {currentUser.fullName}
                </div>
                <button onClick={handleGoProfile} className="mobile-item">My Profile</button>
                <button onClick={handleLogout} className="mobile-item text-red">Logout</button>
             </>
          ) : (
             <button onClick={handleLogin} className="mobile-btn">Login / Start</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default MimoHeader;