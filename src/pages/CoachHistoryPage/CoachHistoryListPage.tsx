import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@mui/material';
import { LuMessageCircle } from 'react-icons/lu';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { Button } from '../../components/Button/Button';
import { useConversationsInfiniteQuery } from '../../queries/conversationsQueryHook';
import { APP_ROUTES } from '../../constants/route';
import type { ConversationStatus } from '../../models/conversation';

const STATUS_LABEL_KEY: Record<ConversationStatus, string> = {
  ACTIVE: 'coach.history.statusActive',
  ENDED: 'coach.history.statusEnded',
  EXTRACTING: 'coach.history.statusExtracting',
  EXTRACTED: 'coach.history.statusEnded',
  EXTRACTION_FAILED: 'coach.history.statusEnded',
};

/** Read-only list of past Aura chat sessions — reachable now that transcripts aren't purged
 * after a session ends (see [[project-mimose-pivot]] purge-after-extraction default flip). */
const CoachHistoryListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useConversationsInfiniteQuery();

  const conversations = useMemo(() => data?.pages.flatMap((page) => page.content) || [], [data]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
      <Breadcrumb
        variant="dark"
        items={[
          { label: t('breadcrumb.home'), path: APP_ROUTES.WELCOME },
          { label: t('breadcrumb.coach'), path: APP_ROUTES.COACH_CHAT },
          { label: t('coach.history.title') },
        ]}
      />
      <h1 className="mt-2 text-2xl font-bold text-coach-text [font-family:var(--font-family-heading)]">
        {t('coach.history.title')}
      </h1>

      {isLoading && (
        <div className="flex justify-center py-10">
          <CircularProgress size={24} />
        </div>
      )}

      {!isLoading && conversations.length === 0 && (
        <p className="mt-8 text-center text-sm text-coach-text-muted">{t('coach.history.empty')}</p>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => navigate(`${APP_ROUTES.COACH_HISTORY}/${conversation.id}`)}
            className="flex items-center gap-3 rounded-xl border border-coach-border bg-coach-surface px-4 py-3 text-left transition-colors hover:bg-coach-bg"
          >
            <LuMessageCircle size={18} className="shrink-0 text-coach-primary" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-coach-text">
                  {new Date(conversation.startedAt).toLocaleString()}
                </span>
                <span className="shrink-0 text-xs text-coach-text-muted">
                  {t(STATUS_LABEL_KEY[conversation.status])}
                </span>
              </div>
              <p className="mt-1 truncate text-xs text-coach-text-muted">
                {conversation.summary || t('coach.history.noSummary')}
              </p>
            </div>
          </button>
        ))}
      </div>

      {hasNextPage && (
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? <CircularProgress size={14} /> : t('entriesPage.loadMore')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CoachHistoryListPage;
