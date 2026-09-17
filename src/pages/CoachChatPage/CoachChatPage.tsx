import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuChevronLeft } from 'react-icons/lu';
import MessageList from '../../components/Chat/MessageList';
import MessageInput from '../../components/Chat/MessageInput';
import InsightCatcherPanel from '../../components/InsightCatcher/InsightCatcherPanel';
import type { ConversationMessage } from '../../models/conversation';
import { conversationsService } from '../../services/conversationsService';
import {
  useSendMessageMutation,
  useEndConversationMutation,
  useSummarizeConversationMutation,
  useConversationsInfiniteQuery,
} from '../../queries/conversationsQueryHook';
import { APP_ROUTES } from '../../constants/route';
import { useSidebarFooter } from '../../layouts/AppShell/AppShellContext';
import { sessionTitleFromSummary } from '../../utils/textUtil';
import './CoachChatPage.scss';

/** Survives a refresh so an in-progress session can be resumed instead of silently restarted. */
const ACTIVE_CONVERSATION_KEY = 'aura_active_conversation_id';

const CoachChatPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [startError, setStartError] = useState<string | null>(null);
  const [catchDraft, setCatchDraft] = useState<string | null>(null);
  const [catchOpenOnMobile, setCatchOpenOnMobile] = useState(false);
  const hasStartedRef = useRef(false);

  const sendMessage = useSendMessageMutation(conversationId ?? '');
  const endConversation = useEndConversationMutation();
  const summarizeConversation = useSummarizeConversationMutation();
  const recentSessions = useConversationsInfiniteQuery();

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

      try {
        const conversation = await conversationsService.startConversation();
        localStorage.setItem(ACTIVE_CONVERSATION_KEY, conversation.id);
        setConversationId(conversation.id);
      } catch (error) {
        const status = (error as { response?: { status?: number } })?.response?.status;
        const serverMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
        setStartError(
          status === 429
            ? serverMessage || t('coach.quotaExceeded')
            : t('coach.startError'),
        );
      }
    };

    resume().finally(() => setIsStarting(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (endConversation.isSuccess) {
      localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
      navigate(APP_ROUTES.HOME);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endConversation.isSuccess]);

  const handleSend = (content: string) => {
    if (!conversationId) return;

    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticUserMessage: ConversationMessage = {
      id: optimisticId,
      role: 'USER',
      content,
      createdAt: new Date().toISOString(),
      moodEmotion: null,
      moodScore: null,
    };
    setMessages((prev) => [...prev, optimisticUserMessage]);
    sendMessage.mutate(content, {
      onSuccess: ({ userMessage, assistantMessage }) => {
        // Swap the optimistic placeholder for the backend-authoritative user message (now
        // carrying its own moodEmotion/moodScore) and append Aura's reply.
        setMessages((prev) => [
          ...prev.map((m) => (m.id === optimisticId ? userMessage : m)),
          assistantMessage,
        ]);
      },
    });
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

  const openCatch = (text: string) => {
    setCatchDraft(text);
    setCatchOpenOnMobile(true);
  };

  const closeCatchSheet = () => setCatchOpenOnMobile(false);

  const handleInsightSaved = () => {
    // Stays on Talk — the Catch panel already gave feedback by clearing its draft. Sending
    // people away from the conversation they were just in to look at what they saved would
    // interrupt the thing this feature exists to not interrupt.
  };

  const handlePersonSaved = () => {
    // Same reasoning as handleInsightSaved above.
  };

  const recentList = useMemo(
    () =>
      (recentSessions.data?.pages.flatMap((p) => p.content) ?? [])
        .filter((c) => c.id !== conversationId)
        .slice(0, 2),
    [recentSessions.data, conversationId],
  );
  useSidebarFooter(
    () => (
      <>
        <div className="app-shell__footer-label">{t('talk.recent')}</div>
        {recentList.length === 0 ? (
          <div className="app-shell__footer-name" style={{ fontWeight: 400, fontSize: 12.5 }}>
            {t('coach.history.empty')}
          </div>
        ) : (
          recentList.map((c) => (
            <button
              key={c.id}
              type="button"
              className="talk-sidebar-session"
              onClick={() => navigate(`${APP_ROUTES.COACH_HISTORY}/${c.id}`)}
            >
              {sessionTitleFromSummary(c.summary, t('coach.history.noSummary'), 44)}
            </button>
          ))
        )}
        <button type="button" className="talk-sidebar-allsessions" onClick={() => navigate(APP_ROUTES.COACH_HISTORY)}>
          {t('talk.allSessions')}
        </button>
      </>
    ),
    [recentList, navigate, t],
  );

  const prefill = (location.state as { prefill?: string } | null)?.prefill;

  return (
    <div className="talk">
      {/* Mobile only — the desktop sidebar is always visible, so this is the only way back to
          Today/Reflect/You while a live conversation has hidden the bottom tab bar (see
          AppShell's MOBILE_FULL_BLEED_PREFIXES). Leaves the session ACTIVE and resumable — the
          composer's "End session" is the deliberate way to close it out instead. */}
      <div className="talk__topbar">
        <button
          type="button"
          className="talk__back"
          onClick={() => navigate(APP_ROUTES.HOME)}
          aria-label={t('talk.back') as string}
        >
          <LuChevronLeft size={22} />
        </button>
      </div>

      <div className="talk__body">
        <div className="talk__main">
          {startError ? (
            <div className="talk__error">
              <p>{startError}</p>
              <button type="button" className="btn btn-secondary" onClick={() => navigate(APP_ROUTES.HOME)}>
                {t('coach.backToDashboard')}
              </button>
            </div>
          ) : (
            <>
              {messages.length === 0 && !isStarting && (
                <div className="talk__empty">{t('coach.emptyState')}</div>
              )}
              {sendMessage.isError && <p className="talk__send-error">{t('coach.sendError')}</p>}
              <MessageList messages={messages} isThinking={sendMessage.isPending || isStarting} onCatch={openCatch} />
              <MessageInput
                onSend={handleSend}
                disabled={!conversationId || sendMessage.isPending}
                initialValue={prefill}
                onOpenCatch={() => openCatch('')}
                onSummarize={handleSummarize}
                summarizeDisabled={!conversationId || messages.length === 0 || summarizeConversation.isPending}
                summarizing={summarizeConversation.isPending}
                onEndSession={handleEndSession}
                endSessionDisabled={!conversationId || endConversation.isPending}
              />
            </>
          )}
        </div>

        <div className={`talk__catch ${catchOpenOnMobile ? 'talk__catch--open' : ''}`}>
          <InsightCatcherPanel
            conversationId={conversationId}
            draftText={catchDraft}
            onSaved={handleInsightSaved}
            onPersonSaved={handlePersonSaved}
            onClose={closeCatchSheet}
          />
        </div>
        {catchOpenOnMobile && <button type="button" className="talk__catch-backdrop" aria-label={t('insightCatcher.cancel') as string} onClick={closeCatchSheet} />}
      </div>
    </div>
  );
};

export default CoachChatPage;
