import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { LuMessageCircle } from 'react-icons/lu';
import { useAuth } from '../../providers/AuthProvider';
import { APP_ROUTES } from '../../constants/route';
import './ChatFab.scss';

/**
 * Persistent floating shortcut into the AI Coach chat, visible across the app (not just the
 * homepage) so the invitation to talk to Aura is always one click away. Hidden on the chat page
 * itself, where it would be redundant.
 */
const ChatFab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  if (location.pathname === APP_ROUTES.COACH_CHAT) return null;

  const handleClick = () => {
    navigate(currentUser ? APP_ROUTES.COACH_CHAT : APP_ROUTES.SIGNUP);
  };

  return (
    <button type="button" onClick={handleClick} className="chat-fab" aria-label={t('chatFab.label')}>
      <LuMessageCircle size={22} />
      <span className="chat-fab__tooltip">{t('chatFab.label')}</span>
    </button>
  );
};

export default ChatFab;
