import { useRef, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button/Button';

/** Mirrors the backend's SendMessageRequestDto @Size(max = 4000) cap. */
const MAX_MESSAGE_LENGTH = 4000;

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

const MessageInput = ({ onSend, disabled }: MessageInputProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeToContent = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t border-coach-border bg-coach-surface px-4 py-3">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          resizeToContent(e.target);
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        maxLength={MAX_MESSAGE_LENGTH}
        placeholder={t('coach.inputPlaceholder') as string}
        className="max-h-32 flex-1 resize-none overflow-y-auto rounded-xl border border-coach-border bg-coach-bg px-3 py-2 text-sm text-coach-text outline-none focus:border-coach-primary disabled:opacity-50"
      />
      <Button variant="primary" onClick={handleSend} disabled={disabled || !value.trim()}>
        {t('coach.send')}
      </Button>
    </div>
  );
};

export default MessageInput;
