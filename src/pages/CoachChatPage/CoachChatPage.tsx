import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MessageList from '../../components/Chat/MessageList';
import MessageInput from '../../components/Chat/MessageInput';
import type { ConversationMessage } from '../../models/conversation';
import { conversationsService } from '../../services/conversationsService';
import { useSendMessageMutation, useEndConversationMutation } from '../../queries/conversationsQueryHook';
import { APP_ROUTES } from '../../constants/route';

const CoachChatPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const hasStartedRef = useRef(false);
  const lastHandledReplyIdRef = useRef<string | null>(null);

  const sendMessage = useSendMessageMutation(conversationId ?? '');
  const endConversation = useEndConversationMutation();

  // Deliberately bypasses useMutation here: calling .mutate() synchronously from a mount
  // effect races with StrictMode's dev-only double-invoke of effects and can leave the
  // mutation observer unsubscribed (confirmed via React internals during debugging) — a plain
  // service call + local state sidesteps it. useMutation is fine below for click-triggered
  // calls (sendMessage/endConversation), which don't hit that mount-time race.
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    conversationsService
      .startConversation()
      .then((conversation) => setConversationId(conversation.id))
      .finally(() => setIsStarting(false));
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

  return (
    <div className="flex h-[calc(100dvh-var(--header-h,64px)-var(--footer-h,64px))] flex-col bg-coach-bg">
      <div className="flex items-center justify-between border-b border-coach-border bg-coach-surface px-4 py-3">
        <div>
          <h1 className="text-base font-semibold text-coach-text">{t('coach.title', 'Coach')}</h1>
          <p className="text-xs text-coach-text-muted">
            {t('coach.subtitle', 'Một không gian để bạn tự đào sâu suy nghĩ của mình')}
          </p>
        </div>
        <button
          type="button"
          onClick={handleEndSession}
          disabled={!conversationId || endConversation.isPending}
          className="rounded-lg border border-coach-border px-3 py-1.5 text-xs font-medium text-coach-text-muted hover:bg-coach-bg disabled:opacity-40"
        >
          {t('coach.endSession', 'Kết thúc phiên')}
        </button>
      </div>

      {messages.length === 0 && !isStarting && (
        <div className="flex flex-1 items-center justify-center px-8 text-center text-sm text-coach-text-muted">
          {t('coach.emptyState', 'Bắt đầu bằng cách chia sẻ điều đang ở trong đầu bạn lúc này.')}
        </div>
      )}

      {sendMessage.isError && (
        <p className="px-4 pb-1 text-center text-xs text-red-500">
          {t('coach.sendError', 'Không thể gửi tin nhắn lúc này. Vui lòng thử lại.')}
        </p>
      )}

      <MessageList messages={messages} isThinking={sendMessage.isPending || isStarting} />

      <MessageInput onSend={handleSend} disabled={!conversationId || sendMessage.isPending} />
    </div>
  );
};

export default CoachChatPage;
