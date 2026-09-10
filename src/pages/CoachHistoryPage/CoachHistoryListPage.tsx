import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useConversationsInfiniteQuery } from '../../queries/conversationsQueryHook';
import { APP_ROUTES } from '../../constants/route';
import { sessionTitleFromSummary, stripMarkdown } from '../../utils/textUtil';
import Loading from '../../components/Loading/Loading';
import './CoachHistoryPage.scss';

/** Read-only list of past Aura chat sessions — reachable now that transcripts aren't purged
 * after a session ends. Search is a local filter over each session's summary text (there's no
 * full-text search endpoint), matching mockup 1e's "Search what you said…" in spirit if not in
 * literal reach — a session with no summary yet just isn't matchable by text. */
const CoachHistoryListPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useConversationsInfiniteQuery();
  const conversations = useMemo(() => data?.pages.flatMap((page) => page.content) ?? [], [data]);
  const total = data?.pages[0]?.total ?? 0;

  const filtered = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter((c) => c.summary && stripMarkdown(c.summary).toLowerCase().includes(q));
  }, [conversations, search]);

  if (isLoading) return <Loading message={t('dashboard.loading') as string} fullHeight />;

  return (
    <div className="sessions-page">
      <div className="sessions-page__head">
        <h3 className="sessions-page__title">{t('coach.history.title')}</h3>
        <input
          type="text"
          className="input"
          placeholder={t('sessions.searchPlaceholder') as string}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="sessions-page__empty">{t('coach.history.empty')}</p>
      ) : (
        <div className="sessions-page__list">
          {filtered.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              className="sessions-page__row"
              onClick={() => navigate(`${APP_ROUTES.COACH_HISTORY}/${conversation.id}`)}
            >
              <span className="sessions-page__row-title">
                {sessionTitleFromSummary(conversation.summary, t('coach.history.noSummary'), 72)}
              </span>
              <span className="sessions-page__row-meta">
                {new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short' }).format(new Date(conversation.startedAt))}
                {conversation.endedAt && ` · ${Math.max(1, Math.round((new Date(conversation.endedAt).getTime() - new Date(conversation.startedAt).getTime()) / 60000))} ${t('sessions.min')}`}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="sessions-page__footer">
        <span className="sessions-page__count">{t('sessions.showing', { current: conversations.length, total })}</span>
        {hasNextPage && (
          <button type="button" className="btn btn-secondary btn-icon" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            ›
          </button>
        )}
      </div>
    </div>
  );
};

export default CoachHistoryListPage;
