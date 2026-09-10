import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { useTranslation } from 'react-i18next';
import type { ConversationMessage } from '../../models/conversation';

interface ChatBubbleProps {
  message: ConversationMessage;
  onCatch?: (content: string) => void;
}

// Minimal, chat-bubble-scoped overrides — deliberately not pulling in @tailwindcss/typography
// for one component. No rehype-raw plugin here on purpose: Aura's replies render as safe
// markdown only, never raw HTML.
const MARKDOWN_COMPONENTS: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-2">
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-black/5 px-1 py-0.5 text-[0.85em]">{children}</code>
  ),
  h1: ({ children }) => <p className="mb-2 font-semibold last:mb-0">{children}</p>,
  h2: ({ children }) => <p className="mb-2 font-semibold last:mb-0">{children}</p>,
  h3: ({ children }) => <p className="mb-2 font-semibold last:mb-0">{children}</p>,
};

/** One turn of the conversation, labeled flush-left above the bubble (Modernist keeps the label
 * outside the bubble rather than an avatar beside it — see mockup 1b). Aura's replies render in
 * the heading typeface, matching the "a real opener" treatment used everywhere else Aura speaks
 * (Today's opener, the landing page). */
const ChatBubble = ({ message, onCatch }: ChatBubbleProps) => {
  const { t } = useTranslation();
  const isUser = message.role === 'USER';
  const isOptimistic = message.id.startsWith('optimistic-');

  return (
    <div className={`chat-bubble-row ${isUser ? 'chat-bubble-row--user' : ''}`}>
      <div className="chat-bubble-label">{isUser ? t('talk.you') : t('brand.name')}</div>
      {isUser ? (
        <div className="chat-bubble chat-bubble--user">{message.content}</div>
      ) : (
        <div className="chat-bubble chat-bubble--aura">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
            {message.content}
          </ReactMarkdown>
        </div>
      )}
      {onCatch && !isOptimistic && (
        <button type="button" className="chat-bubble-catch" onClick={() => onCatch(message.content)}>
          {t('talk.catchThis')}
        </button>
      )}
    </div>
  );
};

export default ChatBubble;
