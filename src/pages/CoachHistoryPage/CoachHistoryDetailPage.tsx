import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MessageList from '../../components/Chat/MessageList';
import { useConversationQuery } from '../../queries/conversationsQueryHook';
import { useSavedFrameworkEntriesInfiniteQuery } from '../../queries/savedFrameworkEntriesQueryHook';
import { APP_ROUTES } from '../../constants/route';
import { firstNonEmptyPayloadField } from '../../utils/textUtil';
import Loading from '../../components/Loading/Loading';
import './CoachHistoryPage.scss';

const SNIPPET_FIELDS: Record<string, string[]> = {
  FREEFORM: ['content'],
  JOHARI_WINDOW: ['open', 'blind', 'hidden', 'unknown'],
  ACT_MATRIX: ['values', 'towardMoves', 'awayMoves', 'fiveSenses'],
  PERSONAL_SWOT: ['strengths', 'weaknesses', 'opportunities', 'threats'],
  LIFE_POSITIONS: ['notes'],
};

const TYPE_TAG_LABEL: Record<string, string> = {
  FREEFORM: 'talk.note',
  JOHARI_WINDOW: 'mirror.title',
  ACT_MATRIX: 'insightCatcher.actMatrix',
  PERSONAL_SWOT: 'insightCatcher.personalSwot',
  LIFE_POSITIONS: 'insightCatcher.lifePositions',
};

/** Read-only transcript view for a past Aura chat session. The "shift" bar reads the backend's
 * own initialMoodEmotion/finalMoodEmotion — null until the session has ended and at least one
 * message in it was scored — so it's omitted entirely rather than shown as a guess when neither
 * end has a score yet. */
const CoachHistoryDetailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: conversation, isLoading, isError } = useConversationQuery(id);
  const { data: notesData } = useSavedFrameworkEntriesInfiniteQuery();
  const caughtHere = useMemo(
    () => (notesData?.pages.flatMap((p) => p.content) ?? []).filter((e) => e.conversationId === id),
    [notesData, id],
  );

  const shift = useMemo(() => {
    if (!conversation) return null;
    const opened = conversation.initialMoodEmotion;
    const closed = conversation.finalMoodEmotion;
    if (!opened && !closed) return null;
    return { opened: opened ?? closed, closed: closed ?? opened };
  }, [conversation]);

  if (isLoading) return <Loading message={t('dashboard.loading') as string} fullHeight />;

  return (
    <div className="session-detail">
      <div className="session-detail__head">
        <div className="session-detail__head-row">
          <h3 className="session-detail__title">
            {conversation ? new Date(conversation.startedAt).toLocaleDateString() : ''}
          </h3>
          <span className="tag tag-outline">{t('sessions.readOnly')}</span>
        </div>
        {shift && (
          <div className="session-detail__shift">
            <span className="session-detail__shift-label">{t('sessions.shift')}</span>
            <span className="session-detail__shift-open">{t(`emotion.${shift.opened}`)}</span>
            <span
              className="session-detail__shift-track"
              style={{ background: 'var(--gradient-mood)' }}
            />
            <span className="session-detail__shift-close">{t(`emotion.${shift.closed}`)}</span>
          </div>
        )}
      </div>

      {isError && <p className="session-detail__error">{t('coach.history.loadError')}</p>}

      {conversation && (
        <>
          {conversation.summary && (
            <div className="session-detail__summary">
              <div className="session-detail__section-label">{t('sessions.whatAuraWrote')}</div>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{conversation.summary}</ReactMarkdown>
            </div>
          )}

          <div className="session-detail__transcript">
            <MessageList messages={conversation.messages} isThinking={false} />
          </div>

          {caughtHere.length > 0 && (
            <div className="session-detail__caught">
              <div className="session-detail__section-label">
                {t('sessions.caughtFromSession', { count: caughtHere.length })}
              </div>
              <div className="session-detail__caught-list">
                {caughtHere.map((entry) => (
                  <div
                    key={entry.id}
                    className={`session-detail__caught-item ${entry.frameworkType === 'JOHARI_WINDOW' ? 'session-detail__caught-item--mirror' : ''}`}
                  >
                    <div className="session-detail__caught-type">{t(TYPE_TAG_LABEL[entry.frameworkType])}</div>
                    <div>{firstNonEmptyPayloadField(entry.payload, SNIPPET_FIELDS[entry.frameworkType] ?? [])}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="session-detail__footer">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(APP_ROUTES.COACH_CHAT)}>
              {t('coach.history.backToChat')}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(APP_ROUTES.COACH_HISTORY)}>
              {t('coach.history.back')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CoachHistoryDetailPage;
