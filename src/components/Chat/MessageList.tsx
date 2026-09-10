import { useEffect, useRef } from 'react';
import type { ConversationMessage } from '../../models/conversation';
import ChatBubble from './ChatBubble';
import ThinkingBubble from './ThinkingBubble';

interface MessageListProps {
  messages: ConversationMessage[];
  isThinking: boolean;
  onCatch?: (content: string) => void;
}

const MessageList = ({ messages, isThinking, onCatch }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isThinking]);

  return (
    <div className="chat-message-list">
      {messages.map((message) => (
        <ChatBubble key={message.id} message={message} onCatch={onCatch} />
      ))}
      {isThinking && <ThinkingBubble />}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
