import { useTranslation } from 'react-i18next';

const ThinkingBubble = () => {
  const { t } = useTranslation();
  return (
    <div className="chat-thinking">
      <span className="chat-thinking-dot" />
      <span className="chat-thinking-label">{t('talk.thinking')}</span>
    </div>
  );
};

export default ThinkingBubble;
