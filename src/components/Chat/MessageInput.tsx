import { useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

const MessageInput = ({ onSend, disabled }: MessageInputProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
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
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        placeholder={t('coach.inputPlaceholder', 'Chia sẻ điều bạn đang nghĩ...') as string}
        className="max-h-32 flex-1 resize-none rounded-xl border border-coach-border bg-coach-bg px-3 py-2 text-sm text-coach-text outline-none focus:border-coach-primary disabled:opacity-50"
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="rounded-xl bg-coach-primary px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40"
      >
        {t('coach.send', 'Gửi')}
      </button>
    </div>
  );
};

export default MessageInput;
