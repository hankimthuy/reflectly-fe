import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuLogOut, LuMenu, LuX } from 'react-icons/lu';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher';
import { Button } from '../../components/Button/Button';
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

  // Separate from handleLogin: this button's copy ("Bắt đầu hành trình") reads as a new-user
  // invitation, so it should land on Signup — same destination as the Hero's CTA — not Login.
  // (Returning users still have a "Log in instead" link from the Signup page.)
  const handleStartJourney = () => {
    setIsMenuOpen(false);
    navigate(APP_ROUTES.SIGNUP, { state: { explicit: true } });
  };

  // The homepage's Hero already has this exact CTA front and center — showing it again in the
  // header on that page is a duplicate, not a second chance. Elsewhere (no Hero on screen) it's
  // the only "get started" affordance, so it stays.
  const isHomepage = location.pathname === APP_ROUTES.WELCOME || location.pathname === APP_ROUTES.HOME;

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
          <div className="mimo-header__nav-links">
            <a
              onClick={() => navigate(APP_ROUTES.WELCOME)}
              className={isActive(APP_ROUTES.WELCOME) ? 'active' : ''}
              style={{ cursor: 'pointer' }}
            >
              {t('nav.garden')}
            </a>
            <a
              onClick={() => navigate(APP_ROUTES.COACH_CHAT)}
              className={isActive(APP_ROUTES.COACH_CHAT) ? 'active' : ''}
              style={{ cursor: 'pointer' }}
            >
              {t('nav.coach')}
            </a>
            <a
              onClick={() => navigate(APP_ROUTES.DASHBOARD)}
              className={isActive(APP_ROUTES.DASHBOARD) ? 'active' : ''}
              style={{ cursor: 'pointer' }}
            >
              {t('nav.dashboard')}
            </a>
            <a
              onClick={() => navigate(APP_ROUTES.ENTRIES_LIST)}
              className={isActive(APP_ROUTES.ENTRIES_LIST) ? 'active' : ''}
              style={{ cursor: 'pointer' }}
            >
              {t('nav.journal')}
            </a>
            {currentUser && (
              <a
                onClick={() => navigate(APP_ROUTES.PROFILE)}
                className={isActive(APP_ROUTES.PROFILE) ? 'active' : ''}
                style={{ cursor: 'pointer' }}
              >
                {t('nav.profile')}
              </a>
            )}
          </div>

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
                    alt={currentUser.fullName}
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
                  <button onClick={handleLogout} className="dropdown-item text-red-500">
                    <LuLogOut size={16} /> {t('profilePage.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mimo-header__auth-section">
              <LanguageSwitcher />
              {!isHomepage && (
                <Button variant="secondary" size="sm" shape="pill" onClick={handleStartJourney}>
                  {t('nav.startJourney')}
                </Button>
              )}
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
          <a onClick={() => navTo(APP_ROUTES.COACH_CHAT)} style={{ cursor: 'pointer' }}>{t('nav.coach')}</a>
          <a onClick={() => navTo(APP_ROUTES.DASHBOARD)} style={{ cursor: 'pointer' }}>{t('nav.dashboard')}</a>
          <a onClick={() => navTo(APP_ROUTES.ENTRIES_LIST)} style={{ cursor: 'pointer' }}>{t('nav.journal')}</a>

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
                      alt={currentUser.fullName}
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
