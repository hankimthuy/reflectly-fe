import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@mui/material';
import { LuArrowLeft } from 'react-icons/lu';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { Button } from '../../components/Button/Button';
import MessageList from '../../components/Chat/MessageList';
import { useConversationQuery } from '../../queries/conversationsQueryHook';
import { APP_ROUTES } from '../../constants/route';

/** Read-only transcript view for a past Aura chat session. */
const CoachHistoryDetailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: conversation, isLoading, isError } = useConversationQuery(id);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4 py-6 sm:px-6">
      <Breadcrumb
        variant="dark"
        items={[
          { label: t('breadcrumb.home'), path: APP_ROUTES.WELCOME },
          { label: t('breadcrumb.coach'), path: APP_ROUTES.COACH_CHAT },
          { label: t('coach.history.title'), path: APP_ROUTES.COACH_HISTORY },
          { label: t('coach.history.sessionTitle') },
        ]}
      />

      <div className="mt-2 flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(APP_ROUTES.COACH_HISTORY)}>
          <LuArrowLeft size={14} />
          <span>{t('coach.history.back')}</span>
        </Button>
        <Button variant="secondary" size="sm" onClick={() => navigate(APP_ROUTES.COACH_CHAT)}>
          {t('coach.history.backToChat')}
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <CircularProgress size={24} />
        </div>
      )}

      {isError && <p className="mt-8 text-center text-sm text-red-500">{t('coach.history.loadError')}</p>}

      {conversation && (
        <>
          {conversation.summary && (
            <div className="mt-4 rounded-xl border border-coach-border bg-coach-surface p-4">
              <h2 className="text-xs font-semibold tracking-wide text-coach-text-muted uppercase">
                {t('coach.history.summaryLabel')}
              </h2>
              <div className="mt-2 text-sm text-coach-text">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{conversation.summary}</ReactMarkdown>
              </div>
            </div>
          )}

          <div className="mt-4 flex-1 rounded-xl border border-coach-border bg-coach-bg">
            <MessageList messages={conversation.messages} isThinking={false} />
          </div>
        </>
      )}
    </div>
  );
};

export default CoachHistoryDetailPage;
