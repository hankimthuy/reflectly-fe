import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuLogOut, LuMenu, LuUser, LuX } from 'react-icons/lu';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher';
import './MimoHeader.scss';

interface MimoHeaderProps {
  scrolled?: boolean;
}

const MimoHeader = ({ scrolled = false }: MimoHeaderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
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
    navigate(APP_ROUTES.WELCOME);
  };

  const handleGoProfile = () => {
    setIsUserMenuOpen(false);
    navigate(APP_ROUTES.PROFILE);
  };

  const handleLogin = () => {
    setIsMenuOpen(false);
    navigate(APP_ROUTES.LOGIN, { state: { explicit: true } });
  };

  const navTo = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`mimo-header mimo-header--garden ${scrolled ? 'mimo-header--scrolled' : ''}`}>
      <div className="mimo-header__container">
        <div className="mimo-header__logo" onClick={() => navigate(APP_ROUTES.WELCOME)}>
          <span>{t('brand.name')}</span>
        </div>

        <div className="mimo-header__nav">
          <a
            onClick={() => navigate(APP_ROUTES.WELCOME)}
            className={isActive(APP_ROUTES.WELCOME) ? 'active' : ''}
            style={{ cursor: 'pointer' }}
          >
            {t('nav.garden')}
          </a>
          <a
            onClick={() => navigate(APP_ROUTES.REFLECTION_ZONE)}
            className={isActive(APP_ROUTES.REFLECTION_ZONE) ? 'active' : ''}
            style={{ cursor: 'pointer' }}
          >
            {t('nav.reflection')}
          </a>
          <a
            onClick={() => navigate(APP_ROUTES.EMOTION_ZONE)}
            className={isActive(APP_ROUTES.EMOTION_ZONE) ? 'active' : ''}
            style={{ cursor: 'pointer' }}
          >
            {t('nav.emotion')}
          </a>
          <a
            onClick={() => navigate(APP_ROUTES.ENERGY_HISTORY)}
            className={isActive(APP_ROUTES.ENERGY_HISTORY) ? 'active' : ''}
            style={{ cursor: 'pointer' }}
          >
            {t('nav.energy')}
          </a>
          <a
            onClick={() => navigate(APP_ROUTES.STATISTICS)}
            className={isActive(APP_ROUTES.STATISTICS) ? 'active' : ''}
            style={{ cursor: 'pointer' }}
          >
            {t('nav.dashboard')}
          </a>
          <a
            onClick={() => navigate(APP_ROUTES.PROTOCOLS)}
            className={isActive(APP_ROUTES.PROTOCOLS) ? 'active' : ''}
            style={{ cursor: 'pointer' }}
          >
            {t('nav.protocols')}
          </a>
          <a
            onClick={() => navigate(APP_ROUTES.PHUONG_PHAP)}
            className={isActive(APP_ROUTES.PHUONG_PHAP) ? 'active' : ''}
            style={{ cursor: 'pointer' }}
          >
            {t('nav.method')}
          </a>

          {currentUser ? (
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

              {isUserMenuOpen && (
                <div className="mimo-header__dropdown">
                  <div className="dropdown-header">
                    <span className="user-name">{currentUser.fullName}</span>
                    <span className="user-email">{currentUser.email}</span>
                  </div>
                  <div className="dropdown-divider" />
                  <div className="dropdown-item language-switcher-item">
                    <LanguageSwitcher />
                  </div>
                  <div className="dropdown-divider" />
                  <button onClick={handleGoProfile} className="dropdown-item">
                    <LuUser size={16} /> {t('nav.profile')}
                  </button>
                  <div className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item text-red-500">
                    <LuLogOut size={16} /> {t('profilePage.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mimo-header__auth-section">
              <LanguageSwitcher />
              <button className="btn-cta" onClick={handleLogin}>
                {t('nav.startJourney')}
              </button>
            </div>
          )}
        </div>

        <button className="mimo-header__toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <LuX /> : <LuMenu />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="mimo-header__mobile-menu">
          <a onClick={() => navTo(APP_ROUTES.WELCOME)} style={{ cursor: 'pointer' }}>{t('nav.garden')}</a>
          <a onClick={() => navTo(APP_ROUTES.REFLECTION_ZONE)} style={{ cursor: 'pointer' }}>{t('nav.reflection')}</a>
          <a onClick={() => navTo(APP_ROUTES.EMOTION_ZONE)} style={{ cursor: 'pointer' }}>{t('nav.emotion')}</a>
          <a onClick={() => navTo(APP_ROUTES.ENERGY_HISTORY)} style={{ cursor: 'pointer' }}>{t('nav.energy')}</a>
          <a onClick={() => navTo(APP_ROUTES.STATISTICS)} style={{ cursor: 'pointer' }}>{t('nav.dashboard')}</a>
          <a onClick={() => navTo(APP_ROUTES.PROTOCOLS)} style={{ cursor: 'pointer' }}>{t('nav.protocols')}</a>
          <a onClick={() => navTo(APP_ROUTES.PHUONG_PHAP)} style={{ cursor: 'pointer' }}>{t('nav.method')}</a>
          <div className="divider" />
          <div className="mobile-language-switcher">
            <LanguageSwitcher />
          </div>
          <div className="divider" />
          {currentUser ? (
            <>
              <div className="mobile-user-info">
                <div className="mobile-avatar-wrapper">
                  {currentUser.pictureUrl && !avatarError ? (
                    <img
                      src={currentUser.pictureUrl}
                      alt="User Avatar"
                      className="mobile-avatar-img"
                      onError={() => setAvatarError(true)}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="mobile-avatar-placeholder">
                      {currentUser.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <span className="mobile-user-name">{currentUser.fullName}</span>
              </div>
              <button onClick={handleGoProfile} className="mobile-item">{t('nav.profile')}</button>
              <button onClick={handleLogout} className="mobile-item text-red">{t('profilePage.logout')}</button>
            </>
          ) : (
            <button onClick={handleLogin} className="mobile-btn">{t('nav.login')}</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default MimoHeader;
