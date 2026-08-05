import { useTranslation } from 'react-i18next';
import { LuMessageCircle } from 'react-icons/lu';
import { ButtonLink } from '../Button/Button';
import { APP_ROUTES } from '../../constants/route';
import auraIdle from '../../assets/aura/aura-idle.gif';

/**
 * Static, illustrative preview of an AI Coach conversation for the (public, unauthenticated)
 * homepage. Deliberately NOT wired to real conversation data — see MessageList/ChatBubble for
 * the live version used inside CoachChatPage once a user is signed in.
 *
 * The Aura avatar sits directly beside the AI turn (not just a small header icon) so the
 * character-to-message association reads clearly at a glance — "this reply is Aura talking".
 */
const ChatPreviewCard = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col rounded-2xl border border-coach-border bg-coach-surface p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-base font-semibold text-coach-text">
          <LuMessageCircle size={18} className="text-coach-primary" />
          {t('homePreview.chat.title')}
        </h3>
        <div className="flex gap-1.5">
          <span className="rounded-full bg-coach-bg px-2.5 py-0.5 text-xs font-medium text-coach-primary">
            {t('homePreview.chat.tag1')}
          </span>
          <span className="rounded-full bg-coach-bg px-2.5 py-0.5 text-xs font-medium text-coach-primary">
            {t('homePreview.chat.tag2')}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5">
        <div className="flex w-full justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-coach-primary px-4 py-2.5 text-sm leading-relaxed text-white">
            {t('homePreview.chat.userMessage')}
          </div>
        </div>
        <div className="flex w-full items-end justify-start gap-2">
          <img
            src={auraIdle}
            alt="Aura"
            className="h-9 w-9 shrink-0 rounded-full border border-coach-border bg-coach-bg object-contain p-0.5"
          />
          <div className="max-w-[75%] rounded-2xl rounded-bl-sm border border-coach-border bg-coach-bg px-4 py-2.5 text-sm leading-relaxed text-coach-text">
            {t('homePreview.chat.aiMessage')}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-full border border-coach-border bg-coach-bg px-4 py-2 text-sm text-coach-text-muted">
        <span className="truncate">{t('homePreview.chat.inputPlaceholder')}</span>
      </div>

      <ButtonLink to={APP_ROUTES.COACH_CHAT} variant="ghost" size="sm" className="mt-3 self-start !px-0">
        {t('homePreview.cta')}
      </ButtonLink>
    </div>
  );
};

export default ChatPreviewCard;
