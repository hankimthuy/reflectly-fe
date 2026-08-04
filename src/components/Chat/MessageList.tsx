import { useEffect, useRef } from 'react';
import type { ConversationMessage } from '../../models/conversation';
import ChatBubble from './ChatBubble';
import ThinkingBubble from './ThinkingBubble';

interface MessageListProps {
  messages: ConversationMessage[];
  isThinking: boolean;
}

const MessageList = ({ messages, isThinking }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isThinking]);

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
      {messages.map((message) => (
        <ChatBubble key={message.id} message={message} />
      ))}
      {isThinking && <ThinkingBubble />}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
