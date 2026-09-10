import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

/** Mirrors the backend's SendMessageRequestDto @Size(max = 4000) cap. */
const MAX_MESSAGE_LENGTH = 4000;

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  /** Seeds the composer once (e.g. Today's opener, carried via router state) — applied on mount
   * only, never overwrites what the person has already started typing. */
  initialValue?: string;
  onOpenCatch: () => void;
  onSummarize: () => void;
  summarizeDisabled?: boolean;
  summarizing?: boolean;
  onEndSession: () => void;
  endSessionDisabled?: boolean;
}

const MessageInput = ({
  onSend,
  disabled,
  initialValue,
  onOpenCatch,
  onSummarize,
  summarizeDisabled,
  summarizing,
  onEndSession,
  endSessionDisabled,
}: MessageInputProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(initialValue ?? '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const seededRef = useRef(false);

  useEffect(() => {
    if (seededRef.current || !initialValue) return;
    seededRef.current = true;
    setValue(initialValue);
  }, [initialValue]);

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
    <div className="chat-composer">
      <div className="chat-composer-row">
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
          className="chat-composer-textarea"
        />
        <button type="button" className="btn btn-primary chat-composer-send" onClick={handleSend} disabled={disabled || !value.trim()}>
          {t('coach.send')}
        </button>
      </div>
      <div className="chat-composer-actions">
        <div className="chat-composer-shortcuts">
          <button type="button" className="tag tag-outline chat-composer-shortcut" onClick={onOpenCatch}>
            {t('talk.catchShortcut')}
          </button>
          <button
            type="button"
            className="tag tag-outline chat-composer-shortcut"
            onClick={onSummarize}
            disabled={summarizeDisabled}
          >
            {summarizing ? t('coach.summarizing') : t('talk.summarizeShortcut')}
          </button>
        </div>
        <button type="button" className="btn btn-secondary chat-composer-end" onClick={onEndSession} disabled={endSessionDisabled}>
          {t('talk.endSessionKeepShift')}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
