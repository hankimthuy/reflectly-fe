import type { ConversationMessage } from '../../models/conversation';

interface ChatBubbleProps {
  message: ConversationMessage;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isUser = message.role === 'USER';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-coach-primary text-white rounded-br-sm'
            : 'bg-coach-surface text-coach-text border border-coach-border rounded-bl-sm'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default ChatBubble;
