import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { APP_ROUTES } from '../../constants/route';
import auraIdle from '../../assets/aura/aura-idle.gif';
import './ChatFab.scss';

// Always hidden here — redundant on the chat page itself.
const ALWAYS_HIDDEN_ROUTES: string[] = [APP_ROUTES.COACH_CHAT];
// On these routes the Hero already has its own primary "talk to Aura" CTA — FAB stays hidden
// while that CTA is on-screen (see the scroll-tracking effect below) and reveals itself once the
// visitor scrolls past it, so there's still always a way back in without ever showing two
// full-strength CTAs at once.
const HERO_CTA_ROUTES: string[] = [APP_ROUTES.WELCOME, APP_ROUTES.HOME];

/**
 * Persistent floating shortcut into the AI Coach chat, so the invitation to talk to Aura is
 * always one click away without ever duplicating a page's own primary CTA. Also hidden on
 * narrower viewports where MobileFooter already has its own dedicated coach shortcuts (see
 * ChatFab.scss).
 *
 * Shows the mascot itself + a short message directly, rather than a generic icon a visitor has
 * to hover to understand.
 */
const ChatFab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const hasHeroCta = HERO_CTA_ROUTES.includes(location.pathname);
  // Assume the hero CTA is on-screen until the observer below says otherwise, so the FAB never
  // flashes visible for a frame on initial load of a hero-CTA route.
  const [heroCtaVisible, setHeroCtaVisible] = useState(true);

  useEffect(() => {
    if (!hasHeroCta) return undefined;

    const target = document.getElementById('hero-cta');
    // The app scrolls inside MainLayout's `.main-content-scroll`, not the window.
    const scrollRoot = document.querySelector('.main-content-scroll');
    if (!target || !scrollRoot) {
      // Nothing to check against (shouldn't normally happen) — leave `heroCtaVisible` at its
      // initial `true` value, erring on the side of not duplicating a CTA.
      return undefined;
    }

    // A plain scroll listener + getBoundingClientRect check, rather than IntersectionObserver —
    // functionally equivalent here (one element, one scroll container) and doesn't depend on the
    // browser having done a compositor pass, which IntersectionObserver callbacks require.
    const checkVisibility = () => {
      const targetRect = target.getBoundingClientRect();
      const rootRect = scrollRoot.getBoundingClientRect();
      setHeroCtaVisible(targetRect.bottom > rootRect.top && targetRect.top < rootRect.bottom);
    };

    checkVisibility();
    scrollRoot.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility);
    return () => {
      scrollRoot.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, [hasHeroCta, location.pathname]);

  if (ALWAYS_HIDDEN_ROUTES.includes(location.pathname)) return null;
  if (hasHeroCta && heroCtaVisible) return null;

  const handleClick = () => {
    navigate(currentUser ? APP_ROUTES.COACH_CHAT : APP_ROUTES.SIGNUP);
  };

  return (
    <button type="button" onClick={handleClick} className="chat-fab" aria-label={t('chatFab.label')}>
      <img src={auraIdle} alt="" aria-hidden="true" className="chat-fab__avatar" />
      <span className="chat-fab__label">{t('chatFab.label')}</span>
    </button>
  );
};

export default ChatFab;
