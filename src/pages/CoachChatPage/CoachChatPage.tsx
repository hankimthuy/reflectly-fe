import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuHistory, LuSparkles } from 'react-icons/lu';
import MessageList from '../../components/Chat/MessageList';
import MessageInput from '../../components/Chat/MessageInput';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { Button } from '../../components/Button/Button';
import InsightCatcherPanel from '../../components/InsightCatcher/InsightCatcherPanel';
import auraIdle from '../../assets/aura/aura-idle.gif';
import type { ConversationMessage } from '../../models/conversation';
import { conversationsService } from '../../services/conversationsService';
import {
  useSendMessageMutation,
  useEndConversationMutation,
  useSummarizeConversationMutation,
} from '../../queries/conversationsQueryHook';
import { APP_ROUTES } from '../../constants/route';

/** Survives a refresh so an in-progress session can be resumed instead of silently restarted. */
const ACTIVE_CONVERSATION_KEY = 'aura_active_conversation_id';

const CoachChatPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [latestSummary, setLatestSummary] = useState<string | null>(null);
  const hasStartedRef = useRef(false);
  const lastHandledReplyIdRef = useRef<string | null>(null);

  const sendMessage = useSendMessageMutation(conversationId ?? '');
  const endConversation = useEndConversationMutation();
  const summarizeConversation = useSummarizeConversationMutation();

  // Deliberately bypasses useMutation here: calling .mutate() synchronously from a mount
  // effect races with StrictMode's dev-only double-invoke of effects and can leave the
  // mutation observer unsubscribed (confirmed via React internals during debugging) — a plain
  // service call + local state sidesteps it. useMutation is fine below for click-triggered
  // calls (sendMessage/endConversation/summarize), which don't hit that mount-time race.
  //
  // On mount, resume a still-ACTIVE conversation stored from a previous mount (e.g. a page
  // refresh) instead of always starting a brand-new, empty one.
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const resume = async () => {
      const storedId = localStorage.getItem(ACTIVE_CONVERSATION_KEY);
      if (storedId) {
        try {
          const existing = await conversationsService.getConversation(storedId);
          if (existing.status === 'ACTIVE') {
            setConversationId(existing.id);
            setMessages(existing.messages);
            return;
          }
        } catch {
          // Stored id is stale or no longer accessible — fall through to starting fresh.
        }
        localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
      }

      const conversation = await conversationsService.startConversation();
      localStorage.setItem(ACTIVE_CONVERSATION_KEY, conversation.id);
      setConversationId(conversation.id);
    };

    resume().finally(() => setIsStarting(false));
  }, []);

  useEffect(() => {
    const reply = sendMessage.data;
    if (reply && reply.id !== lastHandledReplyIdRef.current) {
      lastHandledReplyIdRef.current = reply.id;
      setMessages((prev) => [...prev, reply]);
    }
  }, [sendMessage.data]);

  useEffect(() => {
    if (endConversation.isSuccess) {
      localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
      navigate(APP_ROUTES.DASHBOARD);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endConversation.isSuccess]);

  const handleSend = (content: string) => {
    if (!conversationId) return;

    const optimisticUserMessage: ConversationMessage = {
      id: `optimistic-${Date.now()}`,
      role: 'USER',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUserMessage]);
    sendMessage.mutate(content);
  };

  const handleEndSession = () => {
    if (!conversationId) return;
    endConversation.mutate(conversationId);
  };

  const handleSummarize = () => {
    if (!conversationId) return;
    summarizeConversation.mutate(conversationId, {
      onSuccess: (conversation) => {
        if (!conversation.summary) return;
        setLatestSummary(conversation.summary);
        setMessages((prev) => [
          ...prev,
          {
            id: `summary-${Date.now()}`,
            role: 'ASSISTANT',
            content: `${conversation.summary}\n\n${t('coach.summarizeNudge')}`,
            createdAt: new Date().toISOString(),
          },
        ]);
      },
    });
  };

  const handleInsightSaved = (entryId: string) => {
    navigate(`${APP_ROUTES.ENTRIES_LIST}?highlight=${entryId}`);
  };

  const handlePersonSaved = () => {
    navigate(APP_ROUTES.DASHBOARD);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col lg:h-[calc(100dvh-var(--header-h,64px)-var(--footer-h,64px))] lg:flex-row lg:gap-4 lg:py-4">
      <div className="flex h-[calc(100dvh-var(--header-h,64px)-var(--footer-h,64px))] min-w-0 flex-col border-x border-coach-border bg-coach-bg lg:h-auto lg:flex-1 lg:rounded-2xl lg:border">
        <div className="border-b border-coach-border bg-coach-surface px-4 pt-3 pb-4 sm:px-6">
          <Breadcrumb
            variant="light"
            items={[{ label: t('breadcrumb.home'), path: APP_ROUTES.WELCOME }, { label: t('breadcrumb.coach') }]}
          />
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <img
                src={auraIdle}
                alt=""
                aria-hidden="true"
                className="h-10 w-10 shrink-0 rounded-full border border-coach-border bg-coach-bg object-contain p-0.5"
              />
              <div>
                <h1 className="text-2xl font-bold text-coach-text [font-family:var(--font-family-heading)]">
                  {t('coach.title')}
                </h1>
                <p className="mt-1 text-sm text-coach-text-muted">
                  {t('coach.subtitle')}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(APP_ROUTES.COACH_HISTORY)}
                title={t('coach.historyLink') as string}
              >
                <LuHistory size={16} />
              </Button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSummarize}
              disabled={!conversationId || messages.length === 0 || summarizeConversation.isPending}
            >
              <LuSparkles size={14} />
              <span>{summarizeConversation.isPending ? t('coach.summarizing') : t('coach.summarize')}</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEndSession}
              disabled={!conversationId || endConversation.isPending}
            >
              {t('coach.endSession')}
            </Button>
          </div>
          {summarizeConversation.isError && (
            <p className="mt-1 text-right text-xs text-red-500">{t('coach.summarizeError')}</p>
          )}
        </div>

        {messages.length === 0 && !isStarting && (
          <div className="flex flex-1 items-center justify-center px-8 text-center text-sm text-coach-text-muted">
            {t('coach.emptyState')}
          </div>
        )}

        {sendMessage.isError && (
          <p className="px-4 pb-1 text-center text-xs text-red-500">
            {t('coach.sendError')}
          </p>
        )}

        <MessageList messages={messages} isThinking={sendMessage.isPending || isStarting} />

        <MessageInput onSend={handleSend} disabled={!conversationId || sendMessage.isPending} />
      </div>

      <div className="w-full shrink-0 border-t border-coach-border bg-coach-surface lg:h-auto lg:w-80 lg:overflow-y-auto lg:rounded-2xl lg:border lg:border-t lg:border-coach-border">
        <InsightCatcherPanel
          conversationId={conversationId}
          latestSummary={latestSummary}
          onSaved={handleInsightSaved}
          onPersonSaved={handlePersonSaved}
        />
      </div>
    </div>
  );
};

export default CoachChatPage;
